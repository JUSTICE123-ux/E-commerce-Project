import express from 'express';
import { checkout } from '../controllers/checkout.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Checkout route (JWT-protected)
router.post('/checkout', auth, checkout);

export default router;
