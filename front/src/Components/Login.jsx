import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInput = (e) => {
    const newUserData = { ...userData };
    newUserData[e.target.name] = e.target.value;
    setUserData(newUserData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post('http://127.0.0.1:8000/api/login', userData)
      .then((response) => {
        if (response.data.success === true) {
          window.sessionStorage.setItem('auth_token', response.data.access_token);
          window.sessionStorage.setItem('role', response.data.role);
          window.sessionStorage.setItem('user_id', response.data.data.id);
          navigate('/kursevi');
        } else {
          setErrorMessage('Pogrešan email ili lozinka.');
        }
      })
      .catch((error) => {
        console.error('Greška pri prijavi:', error);
        setErrorMessage('Došlo je do greške. Molimo pokušajte ponovo.');
      });
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Dobrodošli!</h1>
        <p className="login-subtitle">Prijavite se kako biste nastavili svoje obrazovanje.</p>
        {errorMessage && <p className="login-error">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Lozinka"
              value={userData.password}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Prijavi se
          </button>
        </form>
        <p className="register-text">
          Nemate nalog?{' '}
          <button onClick={handleRegisterRedirect} className="register-link">
            Registrujte se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
