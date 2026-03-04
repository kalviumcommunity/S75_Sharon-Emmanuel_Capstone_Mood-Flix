import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getFeedback,
  getStats
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/feedback', getFeedback);
router.get('/stats', getStats);

export default router;
