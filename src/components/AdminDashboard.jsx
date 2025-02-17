import React, { useState, useEffect } from 'react';
import PostUpload from './PostUpload';
import PostList from './PostList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CampusNxtLogo from '../assets/images/CampusNxt.png'; // Adjust the path accordingly
import { FaUserCircle } from 'react-icons/fa'; // Profile icon


function AdminDashboard() {

  const navigate = useNavigate(); 

  const [posts, setPosts] = useState([]);
  const [isUploadVisible, setIsUploadVisible] = useState(false); // State to show/hide PostUpload

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/posts', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          withCredentials: true
        });
        // 'Authorization': `Bearer ${token}`,

        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };
    fetchPosts();
  }, []);

  // Add a new post and save it in the database
  const addPost = async (image, title, description, requirements, date) => {
    try {
      const response = await axios.post('http://localhost:5000/posts', {
        image, title, description, requirements, date, 
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${token}`,
        },
      });
      setPosts([...posts, response.data]); // Add the new post to the state
    } catch (error) {
      console.error('Error adding post', error);
    }
  };

  const deletePost = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${_id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPosts(posts.filter(post => post._id !== _id));  // Remove post from state after deletion
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  // Toggle the visibility of the PostUpload component
  const toggleUploadComponent = () => {
    setIsUploadVisible(!isUploadVisible);
  };

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
    <div className="bg-gray-100 h-screen">

      {/* Header */}
      <header className="flex justify-between items-center bg-red-500 p-4"></header>
      <header className="flex justify-between items-center bg-white p-1">
        <div className="relative flex items-center left-5">
          <img src={CampusNxtLogo} alt="CampusNxt" className="w-40 h-10 object-contain" />
        </div>
        <div>

        <button className="bg-white relative  rounded-full p-2 
          focus:outline-none right-4 top-1" onClick={handlelogout}>
        <FaUserCircle size={30} className='relative right-12' />
        </button>
        </div>
      </header>
      

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        {/* Add Post Button */}
        <button
          onClick={toggleUploadComponent}
          className="bg-red-500 text-white w-[100px] h-16 flex items-center justify-center rounded-lg shadow-lg hover:bg-red-600 fixed bottom-10 right-10"
        >
          AddPost
        </button>


        {/* Post Upload Modal Popup */}
        {isUploadVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
              <button
                onClick={toggleUploadComponent}
                className="absolute top-2 right-2 text-white hover:text-gray-700 bg-red-500 w-8 py-1 rounded-full"
              > X
              </button>
              <PostUpload addPost={addPost} />
            </div>
          </div>

        )}

        {/* Post List */}
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">Existing Internship Posts</h2>
        <PostList posts={posts} deletePost={deletePost} />
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Add Post Button */}
        <button
          onClick={toggleUploadComponent}
          className="bg-blue-500 text-white w-[100px] h-16 rounded-lg shadow-lg hover:bg-blue-600 fixed bottom-[130px] right-[42px]"
        >
          AddPoster
        </button>


        {/* Post Upload Modal Popup */}
        {isUploadVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
              <button
                onClick={toggleUploadComponent}
                className="absolute top-2 right-2 text-white hover:text-gray-700 bg-red-500 w-8 py-1 rounded-full"
              >

                X
              </button>
              <PostUpload addPost={addPost} />
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
