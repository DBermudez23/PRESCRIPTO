import { useContext } from "react"
import { AdminContext } from "../context/AdminContext"
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";


function Sidebar() {

  const {aToken} = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r-2 border-gray-300">
        {
          aToken && 
          <ul className="text-[#515151] mt-5">
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
              <img src={assets.home_icon} alt="" />
              <p>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-all-apointments'}>
              <img src={assets.appointment_icon} alt="" />
              <p>Apointments</p>
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-add-doctor'}>
              <img src={assets.add_icon} alt="" />
              <p>Add Doctor</p>
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-doctor-list'}>
              <img src={assets.people_icon} alt="" />
              <p>Doctor List</p>
            </NavLink>
          </ul>
        }
    </div>
  )
}

export default Sidebar
