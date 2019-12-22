const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../config/models');

router.get('/sandboxes', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);

    const sandboxes = user.sandboxes.map(sandbox => {
        return sandbox.getBasicData()
    })

    res.json(sandboxes);
})

router.get('/sandbox/data', authMiddleware, async (req, res) => {
    const { id } = req.query;

    const user = await User.findById(req.user.id);

    const data = user.sandboxes.id(id).matrix;

    if(data){
        return res.json(data);
    } else {
        return res.status(400).json({ msg: "No sandbox by that id" });
    }
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

router.post('/sandbox/create', authMiddleware, async (req, res) => {
    const { name, matrix, details } = req.body;

    // Make sure they have the required inputs
    if(!name || !matrix){
        return res.status(400).json({ msg: 'Name or matrix missing from request' });
    }

    const user = await User.findById(req.user.id);
    
    // Instantiate a new "sandbox" and insert into user's mongodb document
    user.sandboxes.push({
        name: name,
        matrix: matrix,
        details: details
    });

    user.save()
        .then(savedUser => {
            // We want to return the data in the same format
            // as the "GET /sandboxes" route
            const newSandbox = savedUser.sandboxes[savedUser.sandboxes.length - 1];
            res.json(newSandbox.getBasicData());
        })
        .catch(err => {
            console.log(err);
            res.status(500);
        })
})

module.exports = router;