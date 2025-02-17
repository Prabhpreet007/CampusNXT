import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import handshakeImage from '../assets/images/img.png'; // Ensure correct path to image
import Campus from '../assets/images/CampusNxt.png';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {

    const fetchSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/check-session', {
          withCredentials: true, 
        });
        if (response.data.loggedIn) {
          setRole(response.data.role);
          if (response.data.role === 'admin') {
            navigate('/admin-dashboard'); 
          } else if (response.data.role === 'student') {
            navigate('/student-dashboard'); 
          }
        } else {
          console.log("role error")
          navigate('/login'); 
        }
      } catch (err) {
        console.log("not logged in")
        navigate('/login'); 
      }
    };

    fetchSession();
  }, [navigate]) 


  const handleLogin = async () => {
    try {
      const url = "http://localhost:5000/login";
      const options = {
        method: "POST",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role,
        }),
      };
  
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error('Login failed. Check your credentials.');
      }
  
      const data = await response.json(); // Parse JSON from the response
  
      if (data.token) {
        console.log("Token:", data.token);
        localStorage.setItem('token', data.token); // Save the token in local storage
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        throw new Error('Login failed. No token received.');
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError('Login failed. Check your credentials.');
    }
  };
  

  return (
    <div className="flex justify-center items-center  h-screen bg-neutral-400 relative">
      {/* Company Logo at the top-left corner */}
      <div className="absolute top-12 left-12">
        <img
          src={Campus}
          alt="Company Logo"
          className="w-40 h-25 object-contain" // Adjust size as per requirement
        />
      </div>
      <div className="relative w-full max-w-lg bg-transparent rounded-xl flex justify-center items-center">


        {/* Circular image with overlap */}
        <div className="absolute -left-28 top-1/2 transform -translate-y-1/2 hidden md:flex items-center justify-center z-10">
          <div className="rounded-full overflow-hidden w-90 h-90">
            <img
              src={handshakeImage} // Replace with the actual image path
              alt="Handshake"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Login form */}
        <div className="relative z-30 w-96 border-12 bg-neutral-300 p-10 rounded-lg h-[calc(65vh-3rem)] shadow-2xl right-[-200px]">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <br></br>
          <button
            onClick={handleLogin}
            className="bg-red-500 text-white py-3 rounded-md w-full hover:bg-red-600 transition-colors"
          >
            Login
          </button>
          <div className="flex justify-center items-center ">
  <div className="flex items-center space-x-1">
    <span>Don't have an account?</span>
    <span 
      onClick={() => navigate("/")} 
      className="text-blue-500 hover:text-blue-700 cursor-pointer"
    >
      Signup
    </span>
  </div>
</div>




        </div>
      </div>
    </div>
  );
}

export default Login;
