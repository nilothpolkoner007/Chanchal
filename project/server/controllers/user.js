import Record from '../models/Record.js';
import { uploadToStorage } from '../utils/storage.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await uploadToStorage(req.file);
    
    const record = new Record({
      userId: req.user._id,
      type: req.body.type,
      fileUrl,
      fileName: req.file.originalname
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};