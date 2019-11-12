##### Base route
`https://lazerbubbles-api.herokuapp.com`

##### Login route
`/login`
- POST
- Body:
1. email
2. password

##### Create account route
`/create-account`
- POST
- Body:
1. email
2. password
3. password1
_Note: Password1 is a confirmation of password_

##### Get User details
`/user`
- GET
- Headers:
1. 'Content-Type: application/json'
2. 'x-auth-token: {your jsonwebtoken that you get after logging in}'