import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import handshakeImage from '../assets/images/img.png'; 
import Campus from '../assets/images/CampusNxt.png';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [phNumber,setphNumber]=useState("");
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
          navigate('/'); 
        }
      } catch (err) {
        console.log("not logged in")
        navigate('/'); 
      }
    };

    fetchSession();
  }, [navigate]) 
  
  const getOTPhandle = async () => {

    try {
      console.log(password)
      const response = await axios.post('http://localhost:5000/signup', {
        name,
        email,
        phNumber,
        password,
        role,
      });
      console.log('User registered:', response.data);
      try {
        console.log(`http://localhost:5000/send-otp/${email}`)
        const otpResponse = await axios.get(
          `http://localhost:5000/send-otp/${email}`,
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        console.log('OTP sent:', otpResponse.data);
        setGeneratedOtp(otpResponse.data.otp);
      } catch (error) {
        setError('Failed to send OTP. Please try again later.');
        console.error(error);
      }
      
    } catch (error) {
      setError('Signup failed. User may already exist.');
    }
    
  };
  

  const handleOtpSubmit = () => {
    if (otp === generatedOtp.toString()) {
      console.log('OTP Verified!');

      navigate('/login');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleloginclick = () => {
    navigate('/login');
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

        {/* Signup form */}
        <div className="relative z-30 w-96 border-12 bg-neutral-300 p-10 rounded-lg h-[calc(85vh-3rem)] shadow-2xl right-[-200px]">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Signup</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phNumber}
            onChange={(e) => setphNumber(e.target.value)}
            pattern="[0-9]{10}" 
            maxLength="10" 
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
            onClick={getOTPhandle}
            className="bg-red-500 text-white py-3 rounded-md w-full hover:bg-red-600 transition-colors"
          >
            Get OTP
          </button>

          {generatedOtp && (
            <div className="mt-4">
              <h3>OTP has been sent to your email id :)</h3>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                onClick={handleOtpSubmit}
                className="bg-blue-500 text-white py-3 rounded-md w-full hover:bg-blue-600 transition-colors"
              >
                Submit OTP
              </button>
            </div>
          )}
          <div className="flex justify-center items-center ">

<div className="flex items-center space-x-1">
    <span>Already have an account?</span>
    <span 
      onClick={() => navigate("/login")} 
      className="text-blue-500 hover:text-blue-700 cursor-pointer"
    >
      Login
    </span>
  </div>
  </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
