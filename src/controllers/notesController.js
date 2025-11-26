import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// ===== GET ALL NOTES (with filtering + pagination) =====
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const query = {};

    if (tag) {
      query.tag = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * perPage;

    const [notes, totalNotes] = await Promise.all([
      Note.find(query).skip(skip).limit(perPage),
      Note.countDocuments(query),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// ===== GET NOTE BY ID =====
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// ===== CREATE NOTE =====
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// ===== UPDATE NOTE =====
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

// ===== DELETE NOTE =====
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
