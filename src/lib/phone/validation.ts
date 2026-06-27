import {
  DEFAULT_DIAL_CODE,
  getDialCodes,
  type PhoneCountry,
} from './countries';

export type ParsedPhoneNumber = {
  dialCode: string;
  nationalNumber: string;
};

const E164_REGEX = /^\+[1-9]\d{6,14}$/;

export function formatPhoneNumber(
  dialCode: string,
  nationalNumber: string,
): string {
  const digits = nationalNumber.replace(/\D/g, '');
  return `${dialCode}${digits}`;
}

export function parseStoredPhoneNumber(
  phoneNumber: string,
  defaultDialCode: string = DEFAULT_DIAL_CODE,
): ParsedPhoneNumber {
  const trimmed = phoneNumber.trim();
  if (!trimmed) {
    return { dialCode: defaultDialCode, nationalNumber: '' };
  }

  const normalized = trimmed.replace(/[^\d+]/g, '');

  for (const dialCode of getDialCodes()) {
    if (normalized.startsWith(dialCode)) {
      return {
        dialCode,
        nationalNumber: normalized.slice(dialCode.length).replace(/\D/g, ''),
      };
    }
  }

  const digitsOnly = normalized.replace(/\D/g, '');
  if (digitsOnly.startsWith('0')) {
    return {
      dialCode: defaultDialCode,
      nationalNumber: digitsOnly.slice(1),
    };
  }

  return {
    dialCode: defaultDialCode,
    nationalNumber: digitsOnly,
  };
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const normalized = phoneNumber.trim();
  if (!E164_REGEX.test(normalized) || normalized.length > 20) {
    return false;
  }

  const { dialCode, nationalNumber } = parseStoredPhoneNumber(normalized);
  const knownDialCode = getDialCodes().includes(dialCode);
  if (!knownDialCode) {
    return false;
  }

  if (nationalNumber.length < 6 || nationalNumber.length > 12) {
    return false;
  }

  if (dialCode === DEFAULT_DIAL_CODE && !/^9\d{8}$/.test(nationalNumber)) {
    return false;
  }

  return true;
}

export function getMaxNationalNumberLength(dialCode: string): number {
  if (dialCode === DEFAULT_DIAL_CODE) {
    return 9;
  }

  return Math.min(12, 20 - dialCode.length);
}

export function getDefaultCountry(
  countries: PhoneCountry[],
  dialCode: string,
): PhoneCountry {
  return (
    countries.find((country) => country.dialCode === dialCode) ??
    countries[0] ?? {
      code: 'SK',
      name: 'Slovensko',
      dialCode: DEFAULT_DIAL_CODE,
    }
  );
}
