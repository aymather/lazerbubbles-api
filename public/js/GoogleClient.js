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
    constructor() {
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

    get_google_sheets(credentials) {
        console.log('here');
        // First set the credentials with tokens
        this.OAuth2Client.setCredentials(credentials);

        // Create the google drive client
        const drive = google.drive({ version: 'v3', auth: this.OAuth2Client });

        // Get only the google sheets
        drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
            q: "mimeType='application/vnd.google-apps.spreadsheet'"
        })
        .then(res => {
            console.log('Got response');
            return res.data.files;
        })
        .catch(err => {
            console.log('Got error');
            return err;
        })
    }
}

module.exports = new GoogleClient();