import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword } from "../auth/firebase";
import { Button } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  const handleLogin = () => {
    loginWithEmailAndPassword(email, password);
  };

  const handleLoginOnKeyDown = (e) => {
    if (e.key === "Enter") loginWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/countries");
  }, [loading, user]);

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleLoginOnKeyDown}
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
