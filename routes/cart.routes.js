import express from 'express';
import { addToCart, updateCartItem, removeFromCart, getCart } from '../controllers/cart.controller.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Protect the routes with JWT middleware
router.post('/cart/add', auth, addToCart);
router.put('/cart/update/:productId', auth, updateCartItem);
router.delete('/cart/remove/:productId', auth, removeFromCart);
router.get('/cart', auth, getCart);

export default router;