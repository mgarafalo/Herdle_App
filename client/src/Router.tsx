import { Route, Routes } from 'react-router-dom';
import HerdView from './components/Views/Herd/HerdView';
import Login from './components/Views/Login/Login';
import Profile from './components/Views/Profile/Profile';
import SignUp from './components/Views/Signup/Signup';

export default function AppRouter() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/user/:id' element={<Profile />} />
      <Route path='/user/:id/herd' element={<HerdView />} />
    </Routes>
  );
}
