
import express from 'express';
import { getAllProducts } from '../controllers/product.controller.js';

const router = express.Router();

// GET /products?search=phone&category=electronics
router.get('/', getAllProducts);

export default router;