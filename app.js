const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Init
const app = express();

// Enable Cors
app.use(cors());

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

// Allow access to public folder
app.use(express.static('public'))

// EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/google'));

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
})