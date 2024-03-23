export const EMAIL_SENDER = '"Napmmit" <noreply@napmmit.com>';

export const redirects = {
  toLogin: '/login',
  toSignup: '/signup',
  afterLogin: '/dashboard',
  afterLogout: '/',
  toVerify: '/verify-email',
  afterVerify: '/dashboard',
} as const;
