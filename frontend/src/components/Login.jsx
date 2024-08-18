import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data) {
        dispatch(setAuthUser(res.data.user));
        console.log(res.data);
        
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
        setLoading(false);
    }
  };

  useEffect(() =>{
    if(user) {
      navigate("/")
    }
  },[])
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="m-4">
          <h1 className="text-center font-bold text-xl">ChatterBox</h1>
          <p className="mt-1">
            Login to chatterbox 🤖 & see your friend post's
          </p>
        </div>

        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            className="focus-visible:ring-transparent my-2"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            className="focus-visible:ring-transparent my-2"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>

        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 animate-spin" />
            Please Wait...
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span className="text-center">
          Dosent have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
