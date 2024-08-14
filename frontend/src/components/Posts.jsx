import React, { useEffect } from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/post/getallpost`).then ((res) =>  res.json()).then(res => console.log(res));
    // console.log();
    
  },[])
  
  return (
    <div>
      {
        posts.map((post) => {
            return <Post key={post._id} post={post} />
        })
      }
    </div>
  );
};

export default Posts;
