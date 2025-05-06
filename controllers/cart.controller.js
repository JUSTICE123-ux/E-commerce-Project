import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Add product to the cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
  }
};

// Update product quantity in cart
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Find the cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Update quantity
    item.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item', error: error.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
  }
};

// Get current cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price description category');

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};