import { Route, Routes } from "react-router-dom";
import PostCreator from "./components/UI/Posts/PostCreator";
import HerdView from "./components/Views/Herd/HerdView";
import Login from "./components/Views/Login/Login";
import EditProfile from "./components/Views/Profile/EditProfile";
import Profile from "./components/Views/Profile/Profile";
import SignUp from "./components/Views/Signup/Signup";

export default function AppRouter() {
  return (
    <div className="min-vh-screen" style={{ paddingTop: "65px" }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/herdle/:id" element={<Profile />} />
        <Route path="/herdle/:id/herd" element={<HerdView />} />
        <Route path="/herdle/profile/:id" element={<EditProfile />} />
        <Route path="/posts/new" element={<PostCreator />} />
      </Routes>
    </div>
  );
}
