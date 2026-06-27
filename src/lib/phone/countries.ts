export type PhoneCountry = {
  code: string;
  name: string;
  dialCode: string;
};

export const DEFAULT_DIAL_CODE = '+421';

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'SK', name: 'Slovensko', dialCode: '+421' },
  { code: 'CZ', name: 'Česko', dialCode: '+420' },
  { code: 'AT', name: 'Rakúsko', dialCode: '+43' },
  { code: 'PL', name: 'Poľsko', dialCode: '+48' },
  { code: 'HU', name: 'Maďarsko', dialCode: '+36' },
  { code: 'DE', name: 'Nemecko', dialCode: '+49' },
  { code: 'UA', name: 'Ukrajina', dialCode: '+380' },
  { code: 'GB', name: 'Veľká Británia', dialCode: '+44' },
  { code: 'US', name: 'Spojené štáty', dialCode: '+1' },
  { code: 'CA', name: 'Kanada', dialCode: '+1' },
  { code: 'FR', name: 'Francúzsko', dialCode: '+33' },
  { code: 'IT', name: 'Taliansko', dialCode: '+39' },
  { code: 'ES', name: 'Španielsko', dialCode: '+34' },
  { code: 'NL', name: 'Holandsko', dialCode: '+31' },
  { code: 'BE', name: 'Belgicko', dialCode: '+32' },
  { code: 'CH', name: 'Švajčiarsko', dialCode: '+41' },
  { code: 'SE', name: 'Švédsko', dialCode: '+46' },
  { code: 'NO', name: 'Nórsko', dialCode: '+47' },
  { code: 'DK', name: 'Dánsko', dialCode: '+45' },
  { code: 'FI', name: 'Fínsko', dialCode: '+358' },
  { code: 'IE', name: 'Írsko', dialCode: '+353' },
  { code: 'PT', name: 'Portugalsko', dialCode: '+351' },
  { code: 'GR', name: 'Grécko', dialCode: '+30' },
  { code: 'RO', name: 'Rumunsko', dialCode: '+40' },
  { code: 'BG', name: 'Bulharsko', dialCode: '+359' },
  { code: 'HR', name: 'Chorvátsko', dialCode: '+385' },
  { code: 'SI', name: 'Slovinsko', dialCode: '+386' },
  { code: 'RS', name: 'Srbsko', dialCode: '+381' },
  { code: 'BA', name: 'Bosna a Hercegovina', dialCode: '+387' },
  { code: 'ME', name: 'Čierna Hora', dialCode: '+382' },
  { code: 'MK', name: 'Severné Macedónsko', dialCode: '+389' },
  { code: 'AL', name: 'Albánsko', dialCode: '+355' },
  { code: 'LT', name: 'Litva', dialCode: '+370' },
  { code: 'LV', name: 'Lotyšsko', dialCode: '+371' },
  { code: 'EE', name: 'Estónsko', dialCode: '+372' },
  { code: 'MD', name: 'Moldavsko', dialCode: '+373' },
  { code: 'TR', name: 'Turecko', dialCode: '+90' },
  { code: 'IL', name: 'Izrael', dialCode: '+972' },
  { code: 'AE', name: 'Spojené arabské emiráty', dialCode: '+971' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'CN', name: 'Čína', dialCode: '+86' },
  { code: 'JP', name: 'Japonsko', dialCode: '+81' },
  { code: 'KR', name: 'Južná Kórea', dialCode: '+82' },
  { code: 'AU', name: 'Austrália', dialCode: '+61' },
  { code: 'NZ', name: 'Nový Zéland', dialCode: '+64' },
  { code: 'BR', name: 'Brazília', dialCode: '+55' },
  { code: 'MX', name: 'Mexiko', dialCode: '+52' },
  { code: 'AR', name: 'Argentína', dialCode: '+54' },
  { code: 'ZA', name: 'Južná Afrika', dialCode: '+27' },
];

const DIAL_CODES_BY_LENGTH = [...PHONE_COUNTRIES]
  .map((country) => country.dialCode)
  .sort((a, b) => b.length - a.length);

export function countryFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getCountryByDialCode(
  dialCode: string,
): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((country) => country.dialCode === dialCode);
}

export function getDialCodes(): string[] {
  return DIAL_CODES_BY_LENGTH;
}

export function getCountrySearchValue(country: PhoneCountry): string {
  return `${country.name} ${country.code} ${country.dialCode}`;
}
