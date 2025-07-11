import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';
import axios from 'axios';

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const months = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2];
  }

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      console.log(data)

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      //console.log(appointmentId);
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const paymentAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/payment-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b-1 border-zinc-700'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              <div className='flex flex-col gap-2 justify-end'>
                {/* If appointment is paid and not cancelled, show payment completed */}
                {item.payment && !item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-gray-300 rounded text-gray-400'>
                    Payment completed
                  </button>
                )}

                {/* If appointment is not paid and not cancelled, show pay and cancel buttons */}
                {!item.payment && !item.cancelled && !item.isCompleted &&(
                  <>
                    <button
                      onClick={() => paymentAppointment(item._id)}
                      className='text-stone-500 text-sm text-center sm:min-w-48 py-2 border rounded hover:bg-primary-500 hover:text-white transition-all duration-300'>
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='text-stone-500 text-sm text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                      Cancel appointment
                    </button>
                  </>
                )}

                {/* If appointment is cancelled, show cancelled status */}
                {item.cancelled && !item.isCompleted &&(
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                    Appointment cancelled
                  </button>
                )}

                {/* If appointment is completed, show completed status */}
                {!item.cancelled && item.isCompleted &&(
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                    Completed
                  </button>
                )}

              </div>
            </div>
          </div>
        )
        )}
      </div>
    </div>
  )
}

export default MyAppointments
