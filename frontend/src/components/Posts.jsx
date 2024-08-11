import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store => store.post);
  return (
    <div>
      {
        posts.map((post) => {
            return <Post key={post._is} post={post} />
        })
      }
    </div>
  )
}

export default Posts
