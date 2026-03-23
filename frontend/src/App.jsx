import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage"
import CreateRoomPage from "./components/CreateRoomPage";
import JoinRoomPage from "./components/JoinRoomPage";
import AboutPage from "./components/AboutPage";
import BlogsPage from "./components/BlogPage";
import { useLocation } from "react-router-dom";
import RoomPage from "./pages/RoomPage";



function App() {
  return (
    <div className="bg-[#0D1117] text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
         <Route path="/blogs" element={<BlogsPage />} />
         <Route path="/contact" element={<ContactPage />} />
         <Route path="/create-room" element={<CreateRoomPage />} />
         <Route path="/room/:slug" element={<RoomPage />} />
         <Route path="/join-room" element={<JoinRoomPage />} />
        <Route path="/login" element={<Login />} />
       
        
      </Routes>
    </div>
  );
}

export default App;