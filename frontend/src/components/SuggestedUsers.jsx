import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer ml-2">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div className="flex items-center justify-between my-5" key={user._id}>
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div className="font-semibold text-sm">
                <h1 className="text-gray-600 text-sm">
                  <Link to={`/profile/${user._id}`}>{user?.username}</Link>
                </h1>
              </div>
            </div>
            <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">Follow</span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
