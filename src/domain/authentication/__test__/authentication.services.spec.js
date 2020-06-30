// Exported variable/function mocks
const getUserByEmailWithCredentialsMock = jest.fn();
const generateResetPasswordTokenMock = jest.fn();
const sendMailMock = jest.fn();

jest.doMock('../../users/user.Repository', () => ({
  getUserByEmailWithCredentials: getUserByEmailWithCredentialsMock
}));
jest.doMock('../../../infra/services/mailer', () => sendMailMock);
jest.doMock('../authenticationService', () => ({
  generateResetPasswordToken: generateResetPasswordTokenMock
}));
const authenticationService = require('../authenticationService');

// Private variable/function mocks

describe('authentication.services', () => {
  afterEach(() => {
    jest.resetAllMocks();
  })
  describe('forgetPassword()', () => {
    it('should behave ok', async () => {
      getUserByEmailWithCredentialsMock.mockResolvedValue({
        id: 1,
        UserCredentials: [
          { ExternalType: 'password', ExternalId: 'hashed_password' }
        ]
      });
      await authenticationService.forgetPassword('test@gmail.com');
      expect(sendMailMock).toHaveBeenCalled();
      expect(generateResetPasswordTokenMock).toHaveBeenCalled();
    });
  });

  describe('')
});
