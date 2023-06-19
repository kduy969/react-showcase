import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  console.log("HOME");
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/clock", { replace: true });
  }, []);
  return null;
};

export default Home;
