import React, { useState } from 'react';
function PostUpload({ addPost }) {

  // const[id,setid]=useState(1);
  const [image,setimage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirments,setrequirments] = useState('');
  const [date,setdate] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (title && description) {
      addPost(image,title, description,requirments,date);
      // setid(id+1);
      setimage('');
      setTitle('');
      setDescription('');
      setrequirments('');
      setdate('');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-md p-2 max-w-md mx-auto border border-gray-300 relative">
  
      {/* Heading */}
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Upload Internship Opportunity</h3>
  
      {/* Upload Image */}
      <div className="mb-3">
        <label className="block text-gray-600 font-medium mb-1">Upload Image (PNG/JPG)</label>
        <input type="file" onChange={handleImageUpload} />
        {image && (
          <img
            src={image}
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
    </div>
  );
}  

export default PostUpload;