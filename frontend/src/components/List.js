import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ToDoPopup from './Popup';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import AddTagPopup from './TagPopup';

function ToDoList() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [tagPopupOpen, setTagPopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rows, setRows] = useState([]); // Initialize rows state
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("todoJwtToken");

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:3000/todo', {
      headers: {
        'authorization': jwtToken
      }
    })
    .then(response => {
      setRows(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [jwtToken, navigate, popupOpen, isDeleted, tagPopupOpen]);

  const handleOpenPopup = () => {
    setIsEdit(false);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleEdit = (row) => {
    setIsEdit(row);
    setPopupOpen(true);
  }

  const handleDelete = (id) => {
    axios.post('http://localhost:3000/todo/delete', { id }, {
      headers: {
        'authorization': jwtToken
      }
    })
    setIsDeleted(!isDeleted)
  }

  const handleDeleteTag = (id) => {
    axios.post('http://localhost:3000/tag/delete', { id }, {
      headers: {
        'authorization': jwtToken
      }
    })
    setIsDeleted(!isDeleted)
  }

  const logOut = () => {
    localStorage.removeItem("todoJwtToken");
    navigate('/');
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenPopup}>
        Create New To-Do
      </Button>
      <Button variant="contained" color="primary" onClick={logOut}>
        Log Out
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>To-do</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img src={`https://play.min.io/to-do-files/${row.image_link}`} alt={`img`} style={{ maxHeight: '50px', maxWidth: '50px' }} />
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.comment}</TableCell>
                <TableCell>
                  {row.file_link && (
                    <a href={row.file_link} download>
                      Download File
                    </a>
                  )}
                </TableCell>

                <TableCell>
                {row.tags?.map((tag, index) => (
                  <span key={index} style={{ margin: '0 8px', display: 'inline-block', position: 'relative' }}>
                    {tag.tag}
                    <IconButton
                      size="small"
                      style={{ position: 'absolute', right: -20, top: -5, visibility: 'visible' }}
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                ))}
                <IconButton size="small" onClick={() => setTagPopupOpen(true)}>
                  <AddIcon />
                  {tagPopupOpen && <AddTagPopup
                    isOpen={tagPopupOpen}
                    onClose={() => setTagPopupOpen(false)}
                    rowId={row.id}
                  />}
                </IconButton>
              </TableCell>

                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {popupOpen && <ToDoPopup isEdit={isEdit} isOpen={popupOpen} closePopup={handleClosePopup} />}
    </>
  );
}

export default ToDoList;
