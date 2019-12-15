const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../config/models');

/**
 * @returns All conversations of the current user
 */
router.get('/conversations', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);

    
})

/**
 * @param id
 * @returns Conversation between current user and a specific other user
 */
router.get('/conversations', authMiddleware, async (req, res) => {
    const current_user = await User.findById(req.user.id);
    const other_user = await User.findById(req.params.id);

    current_user.conversations
})

module.exports = router;