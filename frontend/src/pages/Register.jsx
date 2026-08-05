import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
    company: "",
    headline: "",
  });

  const [error, setError] = useState("");

  const { register, logout } = useAuth();
  const navigate = useNavigate();


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      await register(form);

      logout();

      navigate("/login", {
        state: {
          justRegistered: true,
          email: form.email
        }
      });


    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }

  };



  return (

    <div className="auth-page">


      <div className="register-container">


        {/* LEFT BRAND SECTION */}

        <div className="register-left">


          <div className="brand-logo">
            💼
          </div>


          <h1>
            Join Job Portal
          </h1>


          <h2>
            Build Your Future
          </h2>


          <p>
            Create your profile and connect with
            thousands of career opportunities.
          </p>



          <div className="feature-list">


            <div className="feature-card">
              🚀 Easy Job Search
            </div>


            <div className="feature-card">
              💼 Top Companies
            </div>


            <div className="feature-card">
              ⭐ Career Growth
            </div>


          </div>


        </div>




        {/* REGISTER FORM */}


        <form
          className="register-form"
          onSubmit={handleSubmit}
        >


          <h2>
            Create Account
          </h2>


          <p className="subtitle">
            Join us and start your journey
          </p>



          {error && (

            <p className="error">
              {error}
            </p>

          )}




          <div className="input-group">

            <input

              name="name"

              placeholder="Full Name"

              value={form.name}

              onChange={handleChange}

              required

            />

          </div>




          <div className="input-group">

            <input

              type="email"

              name="email"

              placeholder="Email Address"

              value={form.email}

              onChange={handleChange}

              required

            />

          </div>




          <div className="input-group">


            <input

              type="password"

              name="password"

              placeholder="Password (minimum 6 characters)"

              value={form.password}

              onChange={handleChange}

              minLength={6}

              required

            />


          </div>




          <div className="input-group">


            <select

              name="role"

              value={form.role}

              onChange={handleChange}

            >

              <option value="seeker">
                Job Seeker
              </option>


              <option value="employer">
                Employer
              </option>


            </select>


          </div>




          {form.role === "employer" ? (

            <div className="input-group">


              <input

                name="company"

                placeholder="Company Name"

                value={form.company}

                onChange={handleChange}

              />


            </div>


          ) : (


            <div className="input-group">


              <input

                name="headline"

                placeholder="Headline (Example: Frontend Developer)"

                value={form.headline}

                onChange={handleChange}

              />


            </div>


          )}




          <button

            type="submit"

            className="btn-primary"

          >

            Create Account

          </button>




          <div className="bottom-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>


          </div>



        </form>



      </div>


    </div>

  );

}