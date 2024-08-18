import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data) {
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
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
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="m-4">
          <h1 className="text-center font-bold text-xl">ChatterBox</h1>
          <p className="mt-1">
            Signup to chatterbox 🤖 & see your friend post's
          </p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Already have an account?{" "}
          <Link className="to-blue-800" to="/login">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
