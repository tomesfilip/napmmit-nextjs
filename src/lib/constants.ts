import { Service } from '@/server/db/schema';
import { CottageArea } from './appTypes';

export const USER_ID_LENGTH = 21;
export const PASSWORD_ID_LENGTH = 40;

export const APP_TITLE = 'Napmmit';
export const EMAIL_SENDER = `"${APP_TITLE}" <noreply@napmmit.com>`;
export const EMAIL_SENDER_RESEND = 'onboarding@resend.dev';

export const ROUTES = {
  AUTH: {
    SIGNUP: '/signup',
    LOGIN: '/login',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  COTTAGE_DETAIL: '/cottage',
  CREATE_COTTAGE: {
    STEP_ONE: 'step-one',
    STEP_TWO: 'step-two',
    STEP_THREE: 'step-three',
    STEP_FOUR: 'step-four',
    STEP_FIVE: 'step-five',
    STEP_SIX: 'step-six',
  },
  DASHBOARD: {
    INDEX: '/dashboard',
    RESERVATIONS: '/dashboard/reservations',
  },

  EDIT_COTTAGE: '/edit',
} as const;

export const SERVICES: Service[] = [
  { id: 1, name: 'raňajky', icon: 'Breakfast' },
  { id: 2, name: 'večera', icon: 'Food' },
  { id: 3, name: 'sprcha', icon: 'Shower' },
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

export const MAX_IMAGES_PER_COTTAGE = 8;
export const MIN_FILE_SIZE_TO_COMPRESS_KB = 300;
