import React, { useState } from 'react';
import axios from 'axios';

const AddTagPopup = ({ isOpen, onClose, rowId }) => {
  const jwtToken = localStorage.getItem("todoJwtToken");
  const handleAddTag = () => {
    axios.post('http://localhost:3000/tag', { todoId: rowId, tag: tagName }, {
        headers: {
            'authorization': jwtToken
        }
    })
    }

  const [tagName, setTagName] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, backgroundColor: '#fff', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAddTag()
          onClose();
        }}
      >
        <input
          type="text"
          placeholder="Enter tag name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Tag</button>
      </form>
      <button onClick={onClose} style={{ display: 'block', marginTop: '10px' }}>Cancel</button>
    </div>
  );
};

export default AddTagPopup