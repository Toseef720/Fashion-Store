import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to generate a signed JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 2. Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save new user to MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Verify existence and match password hash
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses || [],
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new address
// @route   POST /api/users/addresses
export const addAddress = async (req, res) => {
  try {
    const { street, city, state, zip, country } = req.body;
    if (!street || !city || !country) {
      return res
        .status(400)
        .json({ message: "Street, city, and country are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = { street, city, state: state || "", zip: zip || "", country };
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an address
// @route   PUT /api/users/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, zip, country } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zip !== undefined) address.zip = zip;
    if (country !== undefined) address.country = country;

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.pull({ _id: id });
    await user.save();

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};