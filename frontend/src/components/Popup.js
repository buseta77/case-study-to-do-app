import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ToDoPopup = ({ isEdit, isOpen, closePopup }) => {
  const [title, setTitle] = useState('');
  const [todo, setTodo] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setTitle(isEdit.title);
      setTodo(isEdit.comment);
      setImage(isEdit.image_link);
      setFile(isEdit.file_link);
    }
  }, [isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwtToken = localStorage.getItem("todoJwtToken")

    const formData = new FormData();
    formData.append('title', title);
    formData.append('comment', todo);
    formData.append('image', image);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/todo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': jwtToken
        }
      });
      console.log('Form submitted:', response.data);
      closePopup();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup_inner">
        {isEdit ? <h1>Edit To-Do</h1> : <h1>Create New To-Do</h1>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="To-Do"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <label htmlFor="image-upload">Upload Image:</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="file-upload">Upload File:</label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Save To-Do</button>
          <button type="button" onClick={closePopup}>Cancel</button>
        </form>
      </div>
      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup_inner {
          background: white;
          padding: 20px;
          border-radius: 5px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input, button {
          margin-top: 10px;
        }
        label {
          display: block;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default ToDoPopup;
