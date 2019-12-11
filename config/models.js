const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SandboxSchema = new Schema({
    majorDimension: { type: String },
    range: { type: String },
    matrix: { type: Array, required: true }
})

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    apis: {
        google_drive: {
            tokens: {
                access_token: { type: String },
                refresh_token: { type: String },
                expiry_date: { type: Number },
                scope: { type: String },
                token_type: { type: String }
            }
        }
    },
    Sandboxes: [SandboxSchema]
})

UserSchema.methods.getBasicData = function() {
    return { 
        email: this.email,
        id: this._id,
        google_api: this.apis.google_drive.tokens
    }
}

const User = mongoose.model('User', UserSchema);
module.exports = User;