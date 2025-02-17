import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import './styles.css';
import AuthComponent from './components/AuthComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Home 
          />} /> */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AuthComponent><AdminDashboard /></AuthComponent>} />
          <Route path="/student-dashboard" element={<AuthComponent><StudentDashboard /></AuthComponent>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
