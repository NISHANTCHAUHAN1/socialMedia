import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Comment = ({ comment }) => {
  const {user} = useSelector(store => store.auth);
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={comment?.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="font-bold text-sm">
               <Link to={`/profile/${user?._id}`}>{comment?.author?.username}</Link>
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
