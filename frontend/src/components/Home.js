import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  const redirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={redirectToLogin}>Login</button>
      <button onClick={redirectToSignup}>Sign Up</button>
    </div>
  );
}

export default HomePage;
