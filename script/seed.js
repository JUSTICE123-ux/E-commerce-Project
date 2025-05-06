// scripts/seedProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

// More realistic starter products
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling over-ear headphones with 30 hours battery life.',
    category: 'electronics',
    price: 89.99,
    stock: 15,
  },
  {
    name: 'Smartphone Tripod Stand',
    description: 'Adjustable phone tripod for stable photo and video shooting.',
    category: 'electronics',
    price: 22.5,
    stock: 30,
  },
  {
    name: 'Python Programming Book',
    description: 'Comprehensive guide to Python programming for beginners.',
    category: 'books',
    price: 34.99,
    stock: 12,
  },
  {
    name: 'Men\'s Casual T-Shirt',
    description: 'Cotton t-shirt with a classic fit and stylish design.',
    category: 'clothing',
    price: 15.0,
    stock: 50,
  },
  {
    name: 'Yoga Mat - Non-Slip',
    description: 'Eco-friendly yoga mat with extra cushioning and grip.',
    category: 'sports',
    price: 27.95,
    stock: 20,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI.',
    category: 'electronics',
    price: 17.49,
    stock: 45,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with deep bass and waterproof design.',
    category: 'electronics',
    price: 45.0,
    stock: 18,
  },
  {
    name: 'Data Structures and Algorithms Book',
    description: 'In-depth resource for mastering DSA in JavaScript.',
    category: 'books',
    price: 39.99,
    stock: 10,
  },
  {
    name: 'Women\'s Running Shoes',
    description: 'Lightweight and breathable shoes designed for comfort.',
    category: 'clothing',
    price: 59.99,
    stock: 25,
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Pair of adjustable dumbbells for home workouts.',
    category: 'sports',
    price: 79.99,
    stock: 8,
  },
];

// Add 40 general-purpose filler products
const categories = ['electronics', 'books', 'clothing', 'sports'];

for (let i = sampleProducts.length + 1; i <= 50; i++) {
  sampleProducts.push({
    name: `Product ${i}`,
    description: `This is a high-quality item number ${i} for your collection.`,
    category: categories[i % 4],
    price: parseFloat((Math.random() * 90 + 10).toFixed(2)),
    stock: Math.floor(Math.random() * 30) + 5,
  });
}

async function seed() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce-product-catalog-sytem` )
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();