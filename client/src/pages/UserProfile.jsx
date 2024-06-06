import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { UserContext } from '../context/userContext';
import axios from 'axios';


const UserProfile = () => {
  
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confrimNewPassword, setconfrimNewPassword] = useState('');
  const [error, setError] = useState('');

  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser?.id}`,
        {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
        
        const {name, email, avatar} = response.data;

        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (error) {
        setError(error.respone.data.message);
      }
    }

    getUser();
  }, []);

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);

      const respone = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, 
      postData,
      {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      setAvatar(respone?.data.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {

      const userData = new FormData();
      userData.set('name', name);
      userData.set('email', email);
      userData.set('currentPassword', currentPassword);
      userData.set('newPassword', newPassword);
      userData.set('confirmNewPassword', confrimNewPassword);

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, 
      userData,
      {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});

      if(response.status == 200) {
        // Log user out to let them relogin again with new credentials
        navigate('/logout');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }
  
  return (
    <section className='profile'>
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My posts</Link>
        
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
            </div>
            {/*---- Form to update avatar ----*/}
            <form className="avatar__form">
              <input 
                onChange={e => setAvatar(e.target.files[0])} 
                type="file" name='avatar' id='avatar' 
                accept='pgn, jpg, jpeg' 
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {
              isAvatarTouched &&
              <button className='profile__avatar-btn' onClick={changeAvatarHandler}><FaCheck /></button>
            }
          </div>

          <h1>{currentUser?.name}</h1>

          {/* form to update user details */}
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {
              error && 
              <p className="form__error-message">{error}</p>
            }
            <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder='Current Password' value={currentPassword} onChange={e => setcurrentPassword(e.target.value)} />
            <input type="password" placeholder='New Password' value={newPassword} onChange={e => setnewPassword(e.target.value)} />
            <input type="password" placeholder='Confirm New Password' value={confrimNewPassword} onChange={e => setconfrimNewPassword(e.target.value)} />
            <button type='submit' className='btn primary'>Update Details</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;