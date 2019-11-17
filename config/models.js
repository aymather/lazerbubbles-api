const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    apis: {
        google_drive: {
            tokens: {
                access_token: { type: String },
                expiry_date: { type: Number },
                scope: { type: String },
                token_type: { type: String }
            }
        },
        google_sheets: {
            tokens: {
                access_token: { type: String },
                expiry_date: { type: Number },
                scope: { type: String },
                token_type: { type: String }
            }
        }
    }
})

UserSchema.methods.returnBasicData = () => {
    return { email: this.email }
}

const User = mongoose.model('User', UserSchema);
module.exports = User;