import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const registerObject = {
  name: "",
  username: "",
  email: "",
  password: "",
};
const Register = () => {
  const [registerDetails, setRegisterDetails] = useState(registerObject);

  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setRegisterDetails({ ...registerDetails, [e.target.name]: e.target.value });
    // console.log(registerDetails);
  };

  const registerRequest = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      "https://twitter-server-ez17.onrender.com/auth/register",
      registerDetails
    );
    if (data?.error) {
      toast.error(data?.error);
    } else {
      localStorage.setItem("auth", JSON.stringify(data));
      setAuth({
        ...auth,
        token: data?.token,
        user: data?.user,
      });
      toast.success("Registration Successful! Please Login");
      navigate("/login");
    }
  };
  return (
    <section className="vh-100 vw-100 bg-primary-subtle">
      <div className="container-fluid h-custom pt-5">
        <h2 className="text-center">Register Here</h2>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 ">
            <form className="text-start">
              <div className="form-outline mb-3">
                <label htmlFor="name">Enter Your Name:</label>
                <input
                  type="text"
                  className="form-control form-control-lg shadow-none "
                  name="name"
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-outline mb-3">
                <label htmlFor="email">Enter Your Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg shadow-none "
                  placeholder="abc@twitter.com"
                  name="email"
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-outline mb-3">
                <label htmlFor="email">Enter Your Username</label>

                <input
                  type="text"
                  className="form-control form-control-lg shadow-none "
                  name="username"
                  onChange={onChange}
                  required
                />
              </div>

              <div className=" mb-3">
                <label htmlFor="email">Enter Password</label>

                <input
                  type="password"
                  className="form-control form-control-lg shadow-none"
                  name="password"
                  onChange={onChange}
                  required
                />
              </div>

              <div className="d-grid text-center text-lg-start">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  onClick={(event) => registerRequest(event)}
                >
                  Register
                </button>
                <p className="fw-semibold mt-2 pt-1 mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="link-primary">
                    Login Here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
