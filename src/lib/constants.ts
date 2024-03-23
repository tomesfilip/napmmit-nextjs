export const ID_LENGTH = 21;

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
