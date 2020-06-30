require('dotenv').config();
const url = require('url');
const redirectUrl = url.resolve(process.env.SERVER_URL, '/auth/facebook/callback');
const axios = require('axios');
const userService = require('../../users/user.Service');

const getRedirectUrl = () => {
  const scopes = "email";
  return `https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&scope=${scopes}`;
}

const handleCallback = async (req) => {
  const access_token = await getAccessToken(req.query.code);

  const fields = 'id,name,email,last_name,first_name,middle_name';
  const { data: profile } = await axios.get(`https://graph.facebook.com/v7.0/me?fields=${fields}&access_token=${access_token}`);

  const [user] = await userService.findOrCreateUser({
    email: profile.email,
    defaultValues: {
      lastName: profile.last_name,
      firstName: profile.middle_name + ' ' + profile.first_name,
      confirm: true
    }
  });

  await userService.findOrCreateUserCredential({
    externalId: profile.id,
    defaultValues: {
      userId: user.id,
      externalType: 'facebook',
      externalId: profile.id,
    }
  });

  const userPayload = {
    id: user.id,
    email: user.email,
    lastName: user.lastName,
    firstName: user.firstName,
  };

  return userPayload;
}

const getAccessToken = async (code) => {
  const tokenUrl = `https://graph.facebook.com/v7.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUrl}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`

  const { data: { access_token } } = await axios.get(tokenUrl);

  return access_token;
}

module.exports = {
  getRedirectUrl,
  handleCallback,
}