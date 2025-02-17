import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostUpload({ addPost }) {

  const navigate = useNavigate();


  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirments, setrequirments] = useState('');
  const [date, setdate] = useState('');


  const handleUpload = async (e) => {
    e.preventDefault();
  
    const url = "http://localhost:5000/image-upload/add-product";
  
    const formData = new FormData();
    formData.append("photo", image); // Ensure "photo" matches the backend key
    formData.append("title", title);
    formData.append("description", description);
    formData.append("requirements", requirments);
    formData.append("date", date);
  
    const options = {
      method: "POST",
      body: formData,
    };
  
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("this is data ",data)
      if (data.image) {
        setImage(data.image); // Set the uploaded image URL for preview
        console.log("Image uploaded:", data.image);
      }
  
      if (title && description) {
        addPost(data.image, title, description, requirments, date);
        setImage(''); 
        setTitle('');
        setDescription('');
        setrequirments('');
        setdate('');
        
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    // navigate("/admin-dashboard")
  };
  

  return (
    <div className="bg-white shadow-xl rounded-md p-2 max-w-md mx-auto border border-gray-300 relative">
      <form encType='multipart/form-data'>
      {/* Heading */}
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Upload Internship Opportunity</h3>

      {/* Upload Image */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Upload Image (PNG/JPG)</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {image && typeof image !== "string" && (
  <img
    src={URL.createObjectURL(image)}
    alt="Preview"
    style={{ width: '80px', height: '80px', margin: '8px 0' }}
  />
)}

      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Description</label>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
        />
      </div>

      {/* Requirements */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Requirements</label>
        <textarea
          placeholder="Requirements"
          value={requirments}
          onChange={(e) => setrequirments(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
        />
      </div>

      {/* Date */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setdate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600"
      >
        Upload
      </button>
      </form>
    </div>
  );
}

export default PostUpload;