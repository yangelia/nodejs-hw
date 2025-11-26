import { Note } from '../models/note.js';
//import createHttpError from 'http-errors';

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
