export const USER_ID_LENGTH = 21;
export const PASSWORD_ID_LENGTH = 40;

export const APP_TITLE = 'Napmmit';
export const EMAIL_SENDER = `"${APP_TITLE}" <noreply@napmmit.com>`;

export const redirects = {
  toLogin: '/login',
  toSignup: '/signup',
  afterLogin: '/dashboard',
  afterLogout: '/',
  toVerify: '/verify-email',
  afterVerify: '/dashboard',
} as const;
