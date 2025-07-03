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

function App() {

  const {aToken} = useContext(AdminContext);

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/admin-all-apointments' element={<AllApointments />} />
          <Route path='/admin-doctor-list' element={<DoctorList/>} />
          <Route path='/admin-add-doctor' element={<AddDoctor/>} />
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

export default App
