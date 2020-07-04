const url = require('url');
const redirectUrl = url.resolve(process.env.SERVER_URL, '/auth/github/callback');
const axios = require('axios');
const userService = require('../../users/user.services');

const getRedirectUrl = () => {
  return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUrl}`;
}

const handleCallback = async req => {
  const access_token = await getAccessToken(req.query.code);

  const { data: profile } = await axios.get(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${access_token}`
    }
  });

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
      externalType: 'github',
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

const getAccessToken = async code => {
  const { data: { access_token } } = await axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: redirectUrl
  }, {
    headers: {
      accept: 'application/json'
    }
  });

  return access_token;
}

module.exports = {
  getRedirectUrl,
  handleCallback,
}