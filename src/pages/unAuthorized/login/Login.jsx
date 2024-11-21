import React, { useState } from 'react'

/* packages...*/
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

/* icons...*/
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

/* assets...*/
import AuthFormLogo from  '@assets/cva-logo.png';

/* components...*/
import ButtonLoader from '@components/ButtonLoader';

/* styles...*/
import '@styles/_auth.css';

/* hooks...*/
import { useLogin } from '@hooks/useMutation';


const Login = () => {

    /* UseState Here...*/
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading,setLoading] =useState(false);

    /* Hooks...*/
    const navigate = useNavigate();

    /* Mutations...*/
    const mutation = useLogin(navigate, setLoading);

    /* Functions Here...*/
    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      if (!trimmedUsername || !trimmedPassword) {
          toast.error('All fields are required');
          setLoading(false);
          return;
      }
      const PAY_LOAD = { 
        username: trimmedUsername, 
        password: trimmedPassword
      };
      mutation.mutate(PAY_LOAD);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  return (
    <div className='auth-body'>
        <div className='auth-form-wraper'>
          <div className='auth-card'>
              <div className="auth-form-head">
                <div className="auth-form-logo">
                  <img src={AuthFormLogo} alt='' />
                </div>
                <h2>Login to your account 👋</h2>
                <p>Welcome back! Please enter your details.</p>
              </div>
              <div className="auth-form-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Username</label>
                      <div className="input-wrap">
                      <input
                          id="email"
                          placeholder="Enter your Username"
                          type="text"
                          className="input-elm"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />
                      </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrap">
                      <input
                          id="password"
                          placeholder="**********"
                          type={showPassword ? "text" : "password"}
                          className="input-elm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="eye-btn" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                    </div>
                  </div>
                  <div className="forgot-btn-wrap">
                    <button>Forgot password</button>
                  </div>
                  <div className="auth-form-btn">
                    <button className="site-btn btn-secondery" disabled={isLoading}>
                      {isLoading ? (
                        <ButtonLoader />
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>
                </form>
                <p className="platform">
                    <span>New on our platform?</span>
                    <Link to={''}>Create an account</Link>
                </p>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Login