import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./context/authContext";

// Route to authenticate the entire pp
const AuthenticatedRoute = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      toast.warning("Please login to continue", {
        toastId: "please login to continue post",
      });
      return navigate("/login");
    }
  }, []);

  return <div className="d-flex flex-column flex-sm-row">{children}</div>;
};

export default AuthenticatedRoute;
