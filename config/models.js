const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Moment = require('moment');


const SandboxSchema = new Schema({
    majorDimension: { type: String },
    range: { type: String },
    values: { type: Array, required: true }
})

const MessageSchema = new Schema({
    message: { type: String },
    timestamp: { type: Date, default: new Moment() }
})

const ConversationSchema = new Schema({
    messages: [MessageSchema],
    created_at: { type: Date, default: new Date() }
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
    Sandboxes: [SandboxSchema],
    Conversations: [ConversationSchema]
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