import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllApointments from './pages/Admin/AllApointments';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

function App() {

  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/*Admin Routes*/}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/admin-all-apointments' element={<AllApointments />} />
          <Route path='/admin-doctor-list' element={<DoctorList/>} />
          <Route path='/admin-add-doctor' element={<AddDoctor/>} />
          {/*Doctor Routes*/}
          <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App;
