const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    apis: {
        google_drive: {
            access_token: { type: String },
            expiry_date: { type: Number }
        },
        google_sheets: {
            access_token: { type: String },
            expiry_date: { type: Number }
        }
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;