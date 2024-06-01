import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../images/avatar1.jpg';
import { FaEdit, FaCheck } from 'react-icons/fa';


const UserProfile = () => {
  
  const [avatar, setAvatar] = useState(Avatar);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confrimNewPassword, setconfrimNewPassword] = useState('');
  
  return (
    <section className='profile'>
      <div className="container profile__container">
        <Link to={`/myposts/sdf`} className='btn'>My posts</Link>
        
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatar} alt="" />
            </div>
            {/* Form to update avatar */}
            <form className="avatar__form">
              <input 
                onChange={e => setAvatar(e.target.files[0])} 
                type="file" name='avatar' id='avatar' 
                accept='pgn, jpg, jpeg' 
              />
              <label htmlFor="avatar"><FaEdit /></label>
            </form>
            <button className='profile__avatar-btn'><FaCheck /></button>
          </div>

          <h1>Ernest Achiever</h1>

          {/* form to update user details */}
          <form className="form profile__form">
            <p className="form__error-message">This is an error message</p>
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