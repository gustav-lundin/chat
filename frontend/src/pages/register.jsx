import { useContext, useEffect } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function Register(props) {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      console.log("register not accessible when logged in");
      const navigate = useNavigate();
      navigate("/");
    }
  });

  return <h1>Register Page</h1>;
}

export default Register;
