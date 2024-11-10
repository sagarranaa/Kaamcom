import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authActions"    ;
import { useNavigate } from "react-router-dom";
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
  
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const response = await dispatch(loginUser(form));
  
      if (response.success) {
        const { user } = response.data;
  
        if (user.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'Employee') {
          navigate('/employee/dashboard');
        }
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    );
  };

export default Login;
