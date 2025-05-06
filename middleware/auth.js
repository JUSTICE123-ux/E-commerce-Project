import jwt from "jsonwebtoken";
import transporter from "../utils/sendMail.js";

export const sendEmail = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const url = `http://localhost:4000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Click the link to verify your email:</p><a href="${url}">Verify Email</a>`,
  });
};


const auth = async (req, res, next) => {
  try {
    // Extract the token from the cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error();
    }

    // Attach the user to the request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export default auth;