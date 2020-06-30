const router = require('express').Router();
const authenticationService = require('./authenticationService');
const { facebookMethod, githubMethod, googleMethod } = require('./methods');
const logger = require('../../infra/logger');
const validate = require('../../app/middlewares/validator');
const { signUpRules } = require('../../infra/schemas/Authentication');
const { validateRefreshToken } = require('../../app/middlewares/validateUser');

router.use('/google', googleMethod);
router.use('/facebook', facebookMethod);
router.use('/github', githubMethod);

router.post('/signup', validate(signUpRules), async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const message = await authenticationService.signUp({ email, password, firstName, lastName }, { needVerify: false });
    return res.status(200).send(message);
  } catch (e) {
    logger.error(e.stack);
    return res.status(400).send(e.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokens = await authenticationService.login({ email, password });
    return res.status(200).json(tokens);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid verification url.");

  await authenticationService.verify(token)
    .then(() => { return res.status(200).send('Your account has been successfully verified.'); })
    .catch(e => { return res.status(404).send(e.message) });
});

router.post('/resend', async (req, res) => {
  const { email } = req.body;
  authenticationService.resendVerifyToken(email)
    .then(() => { return res.status(200).send(`We will send you and email to ${email} to confirm the registration.`) })
    .catch(e => { return res.status(400).send(e.message) });
});

router.post('/forgetPassword', (req, res) => {
  const { email } = req.body;
  authenticationService.forgetPassword(email)
    .then(() => { return res.status(200).send(`If the email ${email} exists in our system, we will send an email to proceed the password recovery.`) })
});

router.get('/reset', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid reset password url.");

  try {
    // Check if the token is expired
    await authenticationService.verifyResetPasswordToken(token);
    return res.sendFile(`${__dirname}/statics/resetPassword.html`, () => { });
  } catch (e) {
    console.log(e);
    return res.status(400).send(e.message);
  }
});

router.post('/resetPassword', (req, res) => {
  const { token, password, confirmPassword } = req.body;
  authenticationService.resetPassword({ token, password, confirmPassword })
    .then(() => { return res.status(200).send('Successfully changed the password. Please sign in again.') })
    .catch(e => { return res.status(400).send(e.message) });
});

router.get('/logout', validateRefreshToken, (req, res) => {
  const { userId, token: accessToken } = req.userInfo;

  authenticationService.logout(userId, accessToken);

  return res.status(200).send('Logout successfully.')
});

router.get('/logoutAllDevices', validateRefreshToken, (req, res) => {
  const { userId } = req.userInfo;

  authenticationService.logoutAllDevices(userId);

  return res.status(200).send('Logout all devices successfully.')
});

router.get('/refresh', validateRefreshToken, async (req, res) => {
  const { userId, token: accessToken } = req.userInfo;

  const tokens = authenticationService.refreshTokens(userId, accessToken)

  return res.status(200).send(tokens);
});

module.exports = router;