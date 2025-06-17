import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title:{ type: String, required: true },
    content: String,
    createdAt:{ type: Date, default: Date.now }
});

export const Note = mongoose.model('Note', NoteSchema);