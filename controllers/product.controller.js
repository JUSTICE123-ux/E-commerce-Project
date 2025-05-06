import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};