import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import { uploadFile, getRecords } from '../controllers/user.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/records', getRecords);

export default router;