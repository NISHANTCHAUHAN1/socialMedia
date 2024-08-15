import { setSuggestedUsers } from '@/redux/authSlice';
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetSuggestUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestUsers = async() => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/suggested`, {withCredentials: true});
            if(res.data) {
                dispatch(setSuggestedUsers(res.data.users));
            }
        } catch (error) {
            console.log(error);     
        }
    }
    fetchSuggestUsers();
  },[])
}

export default useGetSuggestUser
