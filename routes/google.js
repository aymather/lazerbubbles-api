const express = require('express');
const router = express.Router();
const User = require('../config/models');
const authMiddleware = require('../middleware/auth');
const client = require('../public/js/GoogleClient');

router.get('/google/auth', authMiddleware, async (req, res) => {
    res.json({ msg: client.get_auth_uri(req.user.id) });
})

router.get('/google/redirect_uri', async (req, res) => {
    const { code, state } = req.query;

    // Exchage the one-time code for an access token
    var response = await client.get_access_token(code);

    // Save access_token to database
    var { access_token, expiry_date } = response.tokens;
    var user = await User.findById(JSON.parse(state).user_id);
    if(!user){
        return res.status(400).json({ msg: "User id does not exist, this request may have been tampered with by a CSRF attack" });
    }
    user.apis.google_drive.access_token = access_token;
    user.apis.google_drive.expiry_date = expiry_date;

    user.save()
        .then(savedUser => {
            res.json(savedUser);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

module.exports = router;