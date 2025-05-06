import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    // Create an order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Order placement failed', error: error.message });
  }
};