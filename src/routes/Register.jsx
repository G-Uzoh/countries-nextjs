import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from '../auth/firebase';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();

    const registerAccount = () => {
        if (!name) {
            alert("Please enter your name");
        }
        registerWithEmailAndPassword(name, email, password);
    }

    useEffect(() => {
        if (loading) return;
        if (user) console.log("User info: ", user);
        if (user) navigate("/countries");
    }, [loading, user]);

    return (
        <div>
            <h1>Register Account</h1>
            <input type="text" value={name} placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
            <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={registerAccount}>Register</Button>
        </div>
    )
}

export default Register;