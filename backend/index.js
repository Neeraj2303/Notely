import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Note } from './models/Note.js';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/api/notes', notesRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error: ',err);
});


app.get('/api/notes',async(req, res) => {
    try{
        const notes = await await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notes', async (req,res) =>{
    const { title, content }= req.body;
    try{
        const Note = new Note({ title, content});
        await Note.save();
        res.status(201).json(Note);
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

app.put('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try{
        const updated = await Note.findByIdAndUpdate(id, {title, content }, {new: true });
        res.json(updated);
    }catch (err){
        res.status(400).json({error: err.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try{
        await Note.findByIdAndDelete(id);
        res.json({ message: 'Note deleted Sucessfully' });
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
});

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

