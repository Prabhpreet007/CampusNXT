import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon from react-icons
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

              {/* Action button (three dots + delete) */}
              <div className="post-actions flex justify-end mt-2">
                <button
                  onClick={() => handleDotsClick(post._id)}
                  className="dots-button text-gray-500 hover:text-gray-700"
                >
                  &#x22EE;
                </button>
                {showDelete === post._id && (
                  <button
                    onClick={() => deletePost(post._id)}
                    className="delete-button text-white-500 hover:text-grey-700 ml-2"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
