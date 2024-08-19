import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("https://socialmedia-kcjq.onrender.com/api/v1/post/getallpost", {withCredentials: true});
        if (res.data) {
        //   console.log(res.data.posts);
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};

export default useGetPosts;
