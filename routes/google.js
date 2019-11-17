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
    var { tokens } = response;
    var user = await User.findById(JSON.parse(state).user_id);
    if(!user){
        return res.status(400).json({ msg: "User id does not exist, this request may have been tampered with by a CSRF attack" });
    }
    user.apis.google_drive.tokens = tokens;

    user.save()
        .then(savedUser => {
            res.json( { user: savedUser.returnBasicData() });
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.get('/google/sheets', authMiddleware, async (req, res) => {
    // First get the user's api credentials
    var user = await User.findById(req.user.id);
    var { tokens } = user.api.google_drive;

    // Use that to get a list of the google sheets
    var data = client.get_google_sheets(tokens);

    console.log(data);
    res.json(data);
})

module.exports = router;