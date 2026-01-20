import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./userContext/userContext";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ImgBg from "./components/ImgBg";
import Profile from "./components/Profile";
import Job from "./components/Job";
import Register from "./components/Register";
import Login from "./components/Login";
import Status from "./components/Status";
import Favor from "./components/Favor";
import CreateJob from "./components/CreateJob";
import CompDetail from "./components/CompDetail";
import Candidate from "./components/Candidate";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobseeker from "./Layout/Jobseeker";
import Admin from "./Layout/Admin";
import Recruiter from "./Layout/Recruiter";
import ManaAccount from "./components/ManaAccount";
import AddRecuiter from "./components/AddRecruiter";
const App = () => {

  const role = localStorage.getItem("ROLE")
  const hideFooter = window.location.pathname.startsWith("/admin");
  const path = window.location.pathname;
  const hideImgBg = ["/", "/login", "/register"].includes(path) || path.startsWith("/admin");
  //Nếu đường dẫn là /login hoặc /register thì ẩn ảnh nền
  return (  
    <div className="flex flex-col min-h-screen">
      <Router>
        <NavBar />
        {!hideImgBg && <ImgBg className="top-0 left-0 w-full h-full -z-10" />}
        <div className="flex-grow">
          <Routes>
            {(localStorage.getItem("TOKEN") && localStorage.getItem("USER")) ? (
              <Route
                path="/"
                element={
                  <Navigate to={`/${JSON.parse(localStorage.getItem("USER")).role}`} />
                }
              />
            ) : (
              <Route path="/" element={<Navigate to="/login" />} />
            )}

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobseeker" element={
              <ProtectedRoute name="jobseeker">
                <Jobseeker />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/jobseeker/homepage" replace />} />
              <Route path="homepage" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="job" element={<Job />} />
              <Route path="status" element={<Status />} />
              <Route path="favor" element={<Favor />} />
              <Route path="jobDetail/:id" element={<CompDetail />} />
            </Route>
            <Route path="/recruiter" element={
              <ProtectedRoute name="recruiter">
                <Recruiter />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/recruiter/homepage" replace />} />
              <Route path="homepage" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="job" element={<Job />} />
              <Route path="create" element={<CreateJob />} />
              <Route path="candidate" element={<Candidate />} />
              <Route path="jobDetail/:id" element={<CompDetail />} />
            </Route>
            <Route path="/admin" element={
              <ProtectedRoute name="admin">
                <Admin />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/homepage" replace />} />
              <Route path="homepage" element={<ManaAccount />} />
              <Route path="addRecuiter" element={<AddRecuiter />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/jobDetail/:id" element={<CompDetail />} />
            <Route path="/candidate:id" element={<Candidate />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
        {!hideFooter && <Footer />}
        {/* <Footer /> */}
      </Router>
    </div>
  );
};

export default App;
