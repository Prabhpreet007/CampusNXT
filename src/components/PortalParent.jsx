import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

function PortalParent() {
  const [posts, setPosts] = useState([]);

  const addPost = (image, title, description, requirements, date) => {
    const newPost = { id: Date.now(), image, title, description, requirements, date };
    setPosts([...posts, newPost]);
  };

  return (
    <div>
      <h1>Placement Portal</h1>
      {/* Passing addPost to AdminDashboard and posts to both dashboards */}
      <AdminDashboard addPost={addPost} posts={posts} />
      <StudentDashboard posts={posts} />
    </div>
  );
}

export default PortalParent;
