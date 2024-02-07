const User = require("../models/usersModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

   
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const userData = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
      const token = await jwt.sign(
        userData,
        process.env.JWT_KEY,
        { expiresIn: "30 days" }
      );
      res.status(200).json({token, id: user._id});
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
  }
};

exports.Alluser = async(req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
    console.log(error);
  }
};