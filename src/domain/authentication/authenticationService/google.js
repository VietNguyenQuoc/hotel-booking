const url = require('url');
const redirectUrl = url.resolve(process.env.SERVER_URL, '/auth/google/callback');
const { google } = require('googleapis');
const userService = require('../../users/user.services');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl
);

const scopes = [
  'profile',
  'email'
];

const getRedirectUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
}

const handleCallback = async req => {
  const token = await oauth2Client.getToken(req.query.code);

  oauth2Client.credentials = token;

  const { data: profile } = await google.oauth2('v2').userinfo.get({ oauth_token: token.tokens.access_token });

  const [user] = await userService.findOrCreateUser({
    email: profile.email,
    defaultValues: {
      lastName: profile.family_name,
      firstName: profile.given_name,
      confirm: true
    }
  });

  await userService.findOrCreateUserCredential({
    externalId: profile.id,
    defaultValues: {
      externalType: 'google',
      userId: user.id
    }
  });

  const userPayload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return userPayload;
}

module.exports = {
  getRedirectUrl,
  handleCallback,
}

