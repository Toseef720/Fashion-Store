import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

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
        phone: user.phone || "",
        profilePic: user.profilePic || "",
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
        phone: user.phone || "",
        profilePic: user.profilePic || "",
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

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      profilePic: user.profilePic || "",
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile photo to Cloudinary / MongoDB
// @route   PUT /api/users/profile-pic
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl = "";

    // 1. If Cloudinary credentials exist, upload to Cloudinary
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadToCloudinary = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "fashion_store/profiles",
                transformation: [
                  { width: 500, height: 500, crop: "fill", gravity: "face" },
                ],
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            stream.end(req.file.buffer);
          });
        };

        const result = await uploadToCloudinary();
        imageUrl = result.secure_url;
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to MongoDB data URI:", cloudErr.message);
      }
    }

    // 2. If Cloudinary wasn't configured or failed, save directly as Data URI into MongoDB
    if (!imageUrl) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      imageUrl = `data:${req.file.mimetype};base64,${b64}`;
    }

    // Save to MongoDB
    user.profilePic = imageUrl;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Profile pic upload error:", error);
    res.status(500).json({ message: error.message || "Failed to upload image" });
  }
};

// @desc    Update user profile details (name, phone, profilePic)
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, profilePic } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      profilePic: user.profilePic || "",
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};