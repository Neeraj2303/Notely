import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import sheetBackground from './assets/sheet.jpg';
import woodTexture from './assets/frame.jpg';
import pinImage from './assets/pin.png';
import editIcon from './assets/edit.png';

function App() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fallingNotes, setFallingNotes] = useState([]);


  const fetchNotes = async () => {
    const res = await axios.get('https://notely-yfat.onrender.com/api/notes');
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addNote = async () => {
    try {
      const res = await axios.post('https://notely-yfat.onrender.com/api/notes', {
        title: newTitle,
        content: newContent,
      });

      setNotes([res.data, ...notes]);
      setNewTitle('');
      setNewContent('');
      setShowForm(false);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const deleteNote = async (id) => {
    await axios.delete(`https://notely-yfat.onrender.com/api/notes/${noteID}`);
    setNotes(notes.filter((n) => n._id !== id));
  };

  const updateNote = async () => {
    try{
      const res = await axios.put(`https://notely-yfat.onrender.com/api/notes/${noteID}`, {
        title: newTitle,
        content: newContent,
      });
    
      setNotes(notes.map(n => (n._id === editing._id ? res.data : n)));
      setEditing(null);
      setNewTitle('');
      setNewContent('');
      closeForm();
    } catch (err){
      console.error('Error updating note:', err);
  }
};

  const startEditing = (note) => {
    setEditing(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setShowForm(true);
  };

  const handleDeleteWithFall = (id) => {
  setFallingNotes((prev) => [...prev, id]);
  setTimeout(() => {
    deleteNote(id);
    setFallingNotes((prev) => prev.filter((noteId) => noteId !== id));
  }, 800);
};

const closeForm = () => {
  setShowForm(false);
  setEditing(null);
  setNewTitle('');
  setNewContent('');
};

  return (
    <>
      <header
        className="header"
        style={{
          backgroundImage: `url(${woodTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6)',
          width: '100%',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "Pacifico",
            fontSize: '1.7rem',
            color: 'white',
            textShadow: '1px 1px 3px black',
            textDecoration: 'underline',
          }}
        >
          Notely 🗒
        </h1>
      </header>

      <div id="main">
        {showForm && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeForm}>
                ×
              </button>
              <h2>{editing ? 'Edit Note' : 'Add Note'}</h2>
              <input
                type="text"
                placeholder="Note title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Note content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <button onClick={editing ? updateNote : addNote}>
                {editing ? 'Update Note' : 'Add Note'}
              </button>
            </div>
          </div>
        )}

        <div className="notes-grid">
          {notes.map(note => (
            <div className={`sticky-note ${fallingNotes.includes(note._id) ? 'fall' : ''}`} key={note._id}>
              <img src={pinImage} alt="Delete" className="thumb-pin" onClick={() => handleDeleteWithFall(note._id)} title="Delete note"/>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="edit-button-container">
                <img
                src={editIcon}
                alt="Edit"
                className="edit-button"
                onClick={() => startEditing(note)}
                title="Edit note"
                />
                </div>
            </div>
          ))}
        </div>

        <button className="add-button" onClick={() => {
          setEditing(null);
          setNewTitle('');
          setNewContent('');
          setShowForm(true);
        }}>
          +
        </button>
      </div>
    </>
  );
}

export default App;
