import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import todoSVG from '../assets/todo.svg';

const Auth = ({ inputStyle }) => {
    const [cookies, setCookie] = useCookies(['user']);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Password cannot be empty.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email.");
            return;
        }
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "An error occurred. Please try again.");
            }

            const data = await response.json();

            setCookie('Email', data.email, { path: '/' });
            setCookie('AuthToken', data.token, { path: '/' });

            window.location.reload();
        } catch (error) {
            console.error("Registration/Login Error:", error.message);
            setError(error.message);
        }
    };

    const toggleLogin = () => {
        setIsLogin(!isLogin);
        setError('');
    };


  return (
    <div className="auth-container-box">
    <MDBContainer fluid className="p-3 my-7">
            <h2 style={{ textAlign: 'left', marginLeft: '5%'}}>
              {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
            </h2>
        <MDBRow>
            <MDBCol col='10' md='5'>
                <img src={todoSVG} alt='todo' className="img-fluid"/>
            </MDBCol>
            <MDBCol col='8' md='7'>
                <MDBInput  style={{ ...inputStyle }} className='email-input' wrapperClass='mb-4' label='Email' id='emailInput' type='email' size="lg" onChange={(e) => setEmail(e.target.value)}/>
                <MDBInput style={{ ...inputStyle }} wrapperClass='mb-4' label='Password' id='passwordInput' type='password' size="lg" onChange={(e) => setPassword(e.target.value)}/>

                {!isLogin && (
                    <MDBInput style={{ ...inputStyle }} wrapperClass='mb-4' label='Confirm Password' id='confirmPasswordInput' type='password' size="lg" onChange={(e) => setConfirmPassword(e.target.value)}/>
                )}

                {error && <div className="text-danger mb-3">{error}</div>}

                <MDBBtn className="mb-4 w-100" size="lg" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}>
                    {isLogin ? 'Login' : 'Register'}
                </MDBBtn>

                <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                  <p className="mb-0" style={{fontSize: '14px', marginRight: '5px', color: 'white'}}>
                    {isLogin ? "Don't have an account?" : "Have an account?"}
                  </p>
                <MDBBtn className='me-0' color='secondary' onClick={toggleLogin}>
                    {isLogin ? 'Register' : 'Login'}
                </MDBBtn>
              </div>

            </MDBCol>
        </MDBRow>
    </MDBContainer>
    </div>
  );
};

export default Auth;