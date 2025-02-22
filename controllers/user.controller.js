const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(201).json({ success: true, message: "User created successfully", user: { _id: newUser._id, name: newUser.name, email: newUser.email, profile_pic: newUser.profile_pic } });
    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        console.log('request hit')
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ success: true, message: "Login successful", user: { _id: user._id, name: user.name, email: user.email, profile_pic: user.profile_pic } });
    } catch (error) {
        console.log("Error in login: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, profile_pic } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { name, profile_pic }, { new: true });

        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "Profile updated successfully", data: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, profile_pic: updatedUser.profile_pic } });
    } catch (error) {
        console.log("Error in updateProfile: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const checkAuth = (req, res) => {
    try {
        res.status(200).json({success: true, message: 'User is authenticated', data: req.user});
    } catch (error) {
        console.log("Error in checkAuth: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { signup, login, logout, updateProfile, checkAuth };
