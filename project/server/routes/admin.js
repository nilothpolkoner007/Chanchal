import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { 
  getDoctors,
  approveDoctor,
  deleteDoctor,
  getAppointments,
  getUsers
} from '../controllers/admin.js';

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get('/doctors', getDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/appointments', getAppointments);
router.get('/users', getUsers);

export default router;