import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthComponent = ({ children }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

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
          navigate('/'); // Redirect to the default route
        }
      } catch (err) {
        console.log('Not logged in');
        navigate('/'); // Redirect if an error occurs
      }
    };

    fetchSession();
  }, [navigate]);

  // Return children only after validation
  return role ? children : null;
};

export default AuthComponent;
