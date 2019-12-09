const express = require('express');
const router = express.Router();
const User = require('../config/models');
const authMiddleware = require('../middleware/auth');
const client = require('../public/js/GoogleClient');

router.post('/google/redirect_uri', authMiddleware, async (req, res) => {
    const { access_token } = req.body;

    const user = await User.findById(req.user.id);

    user.apis.google_drive.tokens = access_token;

    user.save()
        .then(() => {
            res.json({ msg: "Success!" });
        })
        .catch(err => {
            res.status(500).json({ msg: "Internal server error" });
        })
})

router.get('/google/sheets', authMiddleware, async (req, res) => {
    // First get the user's api credentials
    var user = await User.findById(req.user.id);

    // Check to see if there's a nextPageToken
    var nextPageToken = req.query.nextPageToken;

    // Extract the user's token information
    var { tokens } = user.apis.google_drive;

    // Use that to get a list of the google sheets
    var data = await client.get_google_sheets(tokens, nextPageToken);

    // Return a list of the files ids
    res.json({
        files: data.data.files,
        nextPageToken: data.data.nextPageToken
    });

})

router.get('/google/sheet', authMiddleware, async (req, res) => {
    // We need the sheet_id, sheet_name and rows/columns to select
    const { 
        sheet_id, 
        sheet_name,
        select_1,
        select_2
    } = req.query;

    // Make sure we have all the inputs
    if(!sheet_id || !sheet_name || !select_1 || !select_2) return res.status(400).json({
        msg: "Missing inputs, make sure you have all of the following:\nsheet_id,\nsheet_name,\nselect_1,\nselect_2"
    })

    // Get the user
    const user = await User.findById(req.user.id);
    if(!user) return res.status(400).json({ msg: "User does not exist" });

    // Get the user's credentials
    const { tokens } = user.apis.google_drive;

    // Make request from client
    const options = {
        sheet_id,
        sheet_name,
        select_1,
        select_2
    }
    var sheet_data = await client.get_sheet(tokens, options);
    res.json({ matrix: sheet_data.data });
})

module.exports = router;