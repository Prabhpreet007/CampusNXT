import React, { useState } from 'react';

import './PostList.css'; // Assuming you have a CSS file for custom styling

function PostList({ posts = [], deletePost }) {
  const [showDelete, setShowDelete] = useState(null);

  const handleDotsClick = (id) => {
    setShowDelete(showDelete === id ? null : id);
  };

  return (
    <div className="post-list-container">
      {/* <h3 className="heading">Existing Internship Opportunities</h3> */}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post._id} className="post-card">
<div className="post-content">
  <div className="post-info flex flex-col md:flex-row">
    {/* Image Column */}
    {/* {post.image && (
      <img
        src={post.image}
        alt={post.title}
        className="post-image w-full md:w-1/3 object-cover"
      />
    )} */}
    {post.image && (
  <img
  src={post.image}
  alt={post.title}
  className="post-image w-full md:w-1/3 object-cover"
  style={{ borderRadius: '0' }}
/>
)}

    
    {/* Post Details Column */}
    <div className="post-details flex flex-col justify-between md:ml-4">
      <h4 className="post-title text-lg text-blue-600 font-bold mb-2">{post.title}</h4>

      {/* Make each p tag act like its own row */}
      <div className="space-y-2"> 
        <p className="post-description">
          <span className="font-semibold">Description - </span>{post.description}
        </p>
        <p className="post-requirements">
          <span className="font-semibold">Requirements - </span>{post.requirements}
        </p>
        <p className="post-date">
          <span className="font-semibold">Date - </span>{post.date}
        </p>
      </div>
    </div>
  </div>  
</div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
