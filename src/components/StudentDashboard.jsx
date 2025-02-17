import React, { useState, useEffect } from 'react';
import PostListStudent from "./PostListStudent"
import axios from "axios"
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import CampusLogo from '../assets/images/CampusNxt.png';

// const token = localStorage.getItem('token');
function StudentDashboard() {
  const navigate = useNavigate(); 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };
    fetchPosts();
  }, []);

  const handlelogout=async(error)=>{
    try {
      await axios.post('http://localhost:5000/ProfileLogout/logout', {}, { withCredentials: true });

      localStorage.removeItem('token');
      console.log("token in removed ")

      navigate('/'); 

    } catch (error) {
      console.error('Error logging out', error);
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header with logo */}
      <header className="flex justify-between items-center bg-red-500 p-4"></header>
      <header className="flex justify-between items-center bg-white p-1">
        <div className="relative flex items-center left-5">
          <img src={CampusLogo} alt="CampusNxt" className="w-40 h-10 object-contain" />
        </div>
        <div>
          <button className="bg-white relative  rounded-full p-2 
          focus:outline-none right-4 top-1" onClick={handlelogout}><FaUserCircle size={30} className='relative right-12' /></button>
          

        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto mt-10 p-5">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Internship Opportunities</h2>
        <PostListStudent posts={posts} />
      </main>
    </div>
  );
}

export default StudentDashboard;
