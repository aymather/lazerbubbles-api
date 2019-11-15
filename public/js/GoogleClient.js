const crypto = require('crypto');
const fs = require('fs');
const { google } = require('googleapis');
var credentials_path = 'public/js/google_drive_credentials.json';
var {
    client_id,
    client_secret,
    redirect_uris
} = JSON.parse(fs.readFileSync(credentials_path)).web;
const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

class GoogleClient {
    constructor(){
        this.scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
        this.OAuth2Client = OAuth2Client;
    }

    get_auth_uri(user_id) { 
        const hash = crypto.randomBytes(64).toString('hex');
        const state = JSON.stringify({
            hash,
            user_id
        })
        return this.OAuth2Client.generateAuthUrl({ scope: this.scopes, state }) 
    }

    get_access_token(code) { return this.OAuth2Client.getToken(code); }
}

module.exports = new GoogleClient();