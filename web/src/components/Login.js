import React, { useState } from 'react';
import { webAuth } from '../services/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth.js'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, token, setUser, setToken } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const _user = await signInWithEmailAndPassword(webAuth, email, password);
            setUser(_user.user);
            const customToken = await _user.user.getIdToken();
            setToken(customToken);
            console.log('User logged in:', _user.user);
            console.log('Custom token:', customToken);
        } catch (error) {
            console.error('Error logging in:', error);
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
            {user && <p>You are logged in as: {user.email} </p>}
            {token && <p>With token: {token} </p>}
        </div>
    );
};

export default Login;
