import {
  LEGAL_DOMAIN,
  LEGAL_OPERATOR_EMAIL,
  LEGAL_OPERATOR_ICO,
  LEGAL_OPERATOR_NAME,
  TERMS_EFFECTIVE_DATE,
} from '@/lib/legal/constants';

export {
  LEGAL_DOMAIN,
  LEGAL_OPERATOR_EMAIL,
  LEGAL_OPERATOR_ICO,
  LEGAL_OPERATOR_NAME,
  TERMS_EFFECTIVE_DATE,
};

export const PDF_SUPPLIER_DISPLAY_NAME = 'Filip Tomeš / Napmmit';

export function getLegalTermsUrl() {
  return `https://${LEGAL_DOMAIN}/terms-of-use`;
}

export function getLegalPrivacyUrl() {
  return `https://${LEGAL_DOMAIN}/privacy-policy`;
}
