import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginWithEmailAndPassword, logout } from '../controller/HCMUT_SSO';
import useAuth from '../hooks/useAuth'

const LoginComponent = () => {
    const navigate = useNavigate();
    const { user, token, setUser, setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await loginWithEmailAndPassword(email, password);
            setUser(result.user);
            setToken(result.customToken);
        } catch (error) {
            // Handle login error
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            setUser(null);
            setToken(null);
        } catch (error) {
            // Handle logout error
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={handleLogout}>Logout</button>
            {user && <p>You are logged in as: {user.email} </p>}
            {token && <p>With token: {token} </p>}
            <button onClick={() => navigate('/home')}>HomePage</button>
        </div>
    );
};

export default LoginComponent;
