const User = require("models/User");
const bcrypt = require('bcryptjs'); 
const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const { name, lastname, dateOfBirth, email, password } = req.body;//destructured based on schema refernce
    console.log(req.body);
    // Check if the user exists
    const existingUser = User.findOne({email})
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
    }
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // create new user in the database
    const user = await User.create({
      name, 
      lastname, 
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name : user.name, 
        lastname : user.lastname, 
        dateOfBirth : user.dateOfBirth,
        email : user.email,
        password: hashedPassword,
      },
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    
    res.status(200).json({
      message: "Successfully logged in",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const { name, lastname, email, password } = req.body;
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the fields
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, saltRounds);
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
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

module.exports = {registerUser, loginUser, getLoggedInUser, getUserById, updateUser,deleteUser}; //which is fetched by routes as we imported there