import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../context/userContext';

const DeletePost = () => {
  
  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  // Redirect to login for any users who are not log in
  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  }, []);
  
  return (
    <Link className='btn sm danger'>Delete</Link>
  );
};

export default DeletePost;