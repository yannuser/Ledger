import User from "../models/User.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, dateOfBirth, email, password } = req.body;    
    console.log(req.body);
    // Check if the user exists
    const existingUser = await  User.findOne({email : email});
    console.log(existingUser);

    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
    }
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    // create new user in the database
    const user = await User.create({
      firstname, 
      lastname, 
      dateOfBirth : dateOfBirth || null,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the fields
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, saltRounds);
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userControllers = {registerUser, getLoggedInUser, getUserById, updateUser,deleteUser, getUsers}; //which is fetched by routes as we imported there
export default userControllers;
