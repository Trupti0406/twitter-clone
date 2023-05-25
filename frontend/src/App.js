import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SingleUserPage from "./pages/SingleUserPage";
import SingleTweetPage from "./pages/SingleTweetPage";
import AuthenticatedRoute from "./AuthenticatedRoute";

function App() {
  return (
    <>
      <ToastContainer position="bottom-center" />

      <Routes>
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <Sidebar />
            </AuthenticatedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<SingleUserPage />} />
          <Route path="/tweet/:id" element={<SingleTweetPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
