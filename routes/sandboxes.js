const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../config/models');

router.get('/sandboxes', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);

    const sandboxes = user.sandboxes.map(sandbox => {
        return {
            id: sandbox._id,
            name: sandbox.range
        }
    })

    res.json(sandboxes);
})

router.get('/sandboxes/delete', authMiddleware, async (req, res) => {
    const { sandbox_id } = req.params;

    var user = await User.findById(req.user.id);

    user.sandboxes.id(sandbox_id).remove();

    user.save()
        .then(() => {
            res.json(sandbox_id);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

module.exports = router;