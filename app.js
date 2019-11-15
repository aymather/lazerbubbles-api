const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Init
const app = express();

// Mongo Atlas connect
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to db...');
    })
    .catch(err => {
        console.log(err);
        console.log('Something went wrong connecting to Mongo Atlas');
    })

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/google'));



app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
})