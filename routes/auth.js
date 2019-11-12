const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const User = require('../config/models');
const authMiddleware = require('../middleware/auth');

router.get('/user', authMiddleware, async (req, res) => {
    var user = await User.findById(req.user.id).select('-password').select('-__v');
    
    if(!user) return res.status(400).json({ msg: "User with that ID does not exist" });

    res.json(user);
})

router.post('/create-account', async (req, res) => {
    const { email, password, password1 } = req.body;

    // Make sure form is filled out
    if(!email || !password || !password1) return res.status(400).json({ msg: "Missing inputs" });

    var errors = [];

    // Check for existing user
    var existingUser = await User.findOne({ email });
    if(existingUser) errors.push({ msg: 'That email already exists' });

    // Check that passwords match
    if(password !== password1) errors.push({ msg: 'Passwords do not match' });

    // If any errors, send 400 error
    if(errors.length > 0) return res.status(400).json(errors);

    // Generate password hash
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    // Create user model
    var user = new User({
        email,
        password: hash    
    })

    // Save model to mongo atlas
    user.save()
        .then(savedUser => {
            res.json(savedUser);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    var errors = [];

    // Check that inputs are there
    if(!email || !password) errors.push({ msg: "Missing inputs" });

    // Make sure that email exists
    var user = await User.findOne({ email });
    if(!user) errors.push({ msg: "Account with that email does not exist" });

    // If errors, return 400 response
    if(errors.length > 0) return res.status(400).json(errors);

    // Check if the password matches the hash
    const isMatch = bcrypt.compareSync(password, user.password);
    if(!isMatch) return res.status(400).json({ msg: "Incorrect password" });
    
    // Sign them a jsonwebtoken
    jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
            if(err) return res.status(500).json({ msg: "Error signing jsonwebtoken" });
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            })
        }
    )
})

module.exports = router;