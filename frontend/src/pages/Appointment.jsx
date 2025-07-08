import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import RelatedDoctors from '../Components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams(); // Extracting the doctor ID from the URL parameters
  const { doctors, currencySimbol, backendUrl, token, getDoctorsData } = useContext(AppContext); // Accessing the doctors data from the context
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null); // State to hold the doctor's information
  const [docSlots, setDocSlots] = useState([]); // State to hold the doctor's available slots
  const [slotIndex, setSlotIndex] = useState(0); // State to hold the index of the selected slot
  const [slotTime, setSlotTime] = useState(''); // State to hold the time of the selected slot

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  }

  const getAvaibleSlots = async () => {
    // Resetting the slots state to an empty array before fetching new slots
    setDocSlots([]);

    //Getting current date
    let today = new Date();
    //Calculate 7 days from today
    for (let i = 0; i < 7; i++){
      //Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); // Incrementing the date by i days starting from today

      //Setting end time of the date with index (next day at 9 PM)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i); // Setting the end time to the next day
      endTime.setHours(21, 0, 0, 0); // Setting the end time to 9 PM of the next day

      //Adjusting the current date's hours and minutes based on the current time
      if (today.getDate() === currentDate.getDate()) {
        //Setting hours
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10); // If the current date is today, set the hours to 10 AM or the next hour if it's already past 10 AM
        //Setting minutes
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0); // Setting the current date's hours to 10 AM or the next hour if it's already past 10 AM
      } else {
        // If the current date is not today, set the hours to 10 AM and minutes to 0
        currentDate.setHours(10); // Setting the current date's hours to 10 AM
        currentDate.setMinutes(0); // Setting the current date's hours to 10 AM and minutes to 0
      }

      let timeSlots = []; // Array to hold the available time slots for the current date

      while (currentDate < endTime) {
        //Formatting the date to a readable format (e.g., "10:00 AM")
        let formattedDate = currentDate.toLocaleDateString([], { hour : '2-digit', minute: '2-digit' });

        //Add slot to array
        timeSlots.push({
          date: new Date(currentDate), // Storing the date object for the slot
          time: formattedDate, // Storing the formatted time string for the slot
        });

        //Increment current date (hours and minutes) by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      //Adding the time slots for the current date to the docSlots state
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {

    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }

    try {
      
      const date = docSlots[slotIndex][0].date;
      
      let day = date.getDate();
      let month = date.getMonth()+1; // Start at 0
      let year = date.getFullYear();

      const slotDate = day + '_' + month + '_' + year;
      // console.log(slotDate);

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers:{token}});
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }

  useEffect(() => {
    // Fetching the doctor's information when the component mounts or when doctors or docId changes
    fetchDocInfo();
    
  }, [doctors, docId]);

  useEffect(() => {
    getAvaibleSlots();
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots);
    
  }, [docSlots]);

  return docInfo && (
    <div>
      {/* ---------- Doctors Details ----------------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary-500 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* --------------Doc Info: name, degree, experience ------------ */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* ------- Doctor about ------ */}
          <div>
            <p className='flex items-center text-sm gap-1 font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySimbol}{docInfo.fees}</span> 
          </p>
        </div>
      </div>


      {/* ----------------Booking Slots ----------------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => {
              return (
                <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary-500 text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].date.getDay()]}</p>
                <p>{item[0] && item[0].date.getDate()}</p>
              </div>
              )
            })
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time.split(", ")[1])} className={`text-sm font-ligth flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time.split(", ")[1] === slotTime ? 'bg-primary-500 text-white ' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.split(", ")[1]}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary-500 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>
          Book an appointment
        </button>
      </div>

      {/* ------- Listing Related Doctors --------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
