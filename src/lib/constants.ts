import { CottageArea, ServiceBadgeType } from './appTypes';

export const USER_ID_LENGTH = 21;
export const PASSWORD_ID_LENGTH = 40;

export const APP_TITLE = 'Napmmit';
export const EMAIL_SENDER = `"${APP_TITLE}" <noreply@napmmit.com>`;
export const EMAIL_SENDER_RESEND = 'onboarding@resend.dev';

export const redirects = {
  toLogin: '/login',
  toSignup: '/signup',
  afterLogin: '/dashboard',
  afterLogout: '/',
  toVerify: '/verify-email',
  afterVerify: '/dashboard',
  cottageDetail: '/cottage',
} as const;

export const SERVICES: ServiceBadgeType[] = [
  { name: 'raňajky', icon: 'Breakfast' },
  { name: 'večera', icon: 'Food' },
  { name: 'sprcha', icon: 'Shower' },
] as const;

export const COTTAGE_AREAS: CottageArea[] = [
  { name: 'Biele Karpaty' },
  { name: 'Bukovské Vrchy' },
  { name: 'Javorníky' },
  { name: 'Kremnické vrchy' },
  { name: 'Kysucké Beskydy' },
  { name: 'Malá Fatra' },
  { name: 'Muránska planin' },
  { name: 'Nízke Tatry' },
  { name: 'Oravská Magura a Oravské Beskydy' },
  { name: 'Pieniny' },
  { name: 'Poľana a Veporské vrchy' },
  { name: 'Považský Inovec' },
  { name: 'Slovenský raj' },
  { name: 'Strážovské vrchy a Súľovské vrchy' },
  { name: 'Vysoké Tatry', group: 'Tatry' },
  { name: 'Belianske Tatry', group: 'Tatry' },
  { name: 'Západné Tatry', group: 'Tatry' },
  { name: 'Veľká Fatra a Starohorské vrchy' },
  { name: 'Volovské vrchy' },
  { name: 'Vtáčnik' },
] as const;

export const COOKIE_KEY = 'napmmit_cookie_preferences';
