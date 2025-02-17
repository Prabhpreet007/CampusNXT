import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Placement Portal</h1>
      <div>
        <Link to="/signup">
          <button style={{ marginRight: '10px', padding: '10px 20px' }}>Signup</button>
        </Link>
        <Link to="/login">
          <button style={{ padding: '10px 20px' }}>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
