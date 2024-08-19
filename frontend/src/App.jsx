import React, { useEffect } from 'react'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setlikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>,
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>,
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

const App = () => {
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio);

  const dispatch = useDispatch();
  useEffect(() => {
    if(user) {
      const socketio = io('https://socialmedia-kcjq.onrender.com', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));  
      });

      //
      socketio.on('notification', (notification) => {
        dispatch(setlikeNotification(notification));
      });

      return () => {
        socket?.close();
        dispatch(setSocket(null));
      }
    }
    else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  },[user, dispatch]);


  return (
    <>
      <RouterProvider  router={browserRouter}/>
    </>
  )
}

export default App
