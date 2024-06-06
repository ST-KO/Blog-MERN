import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { UserContext } from '../context/userContext';
import axios from 'axios';

const EditPost = () => {
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorised');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const{id} = useParams();

  // Redirect to login for any users who are not log in
  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  }, []);

  const modules = {
    toolbar: [
      [{'header' : [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment",
  "Uncategorised", "Weather"];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        
        setTitle(response.data.title);
        setCategory(response.data.category);
        setDescription(response.data.description);
      } catch (error) { 
        setError(error.response.data.message);
      }
    }

    getPost();
  }, []);

  const editPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`, 
        postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});

      if(response.status == 200) {
        return navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  
  return (
    <section className='create-post'>
      <div className="container">
        <h2>Edit Post</h2>

        {
          error && 
          <p className='form__error-message'>
            {error}
          </p>
        }

        <form className="form create-post__form" onSubmit={editPost}>
          <input 
            onChange={e => setTitle(e.target.value)} 
            type="text" placeholder='Title' value={title} 
            autoFocus
          />
          <select onChange={e => setCategory(e.target.value)} name="category" value={category}>
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
          <button type='submit' className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;