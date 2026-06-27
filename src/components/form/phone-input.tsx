'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  countryFlagEmoji,
  DEFAULT_DIAL_CODE,
  getCountrySearchValue,
  PHONE_COUNTRIES,
  type PhoneCountry,
} from '@/lib/phone/countries';
import {
  formatPhoneNumber,
  getMaxNationalNumberLength,
  parseStoredPhoneNumber,
} from '@/lib/phone/validation';
import { cn } from '@/lib/utils';

type PhoneInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const DEFAULT_COUNTRY: PhoneCountry = {
  code: 'SK',
  name: 'Slovensko',
  dialCode: DEFAULT_DIAL_CODE,
};

function resolveSelectedCountry(
  parsedDialCode: string,
  preferredCountryCode: string | null,
): PhoneCountry {
  const preferredCountry = preferredCountryCode
    ? PHONE_COUNTRIES.find((country) => country.code === preferredCountryCode)
    : undefined;

  if (preferredCountry?.dialCode === parsedDialCode) {
    return preferredCountry;
  }

  return (
    PHONE_COUNTRIES.find((country) => country.dialCode === parsedDialCode) ??
    DEFAULT_COUNTRY
  );
}

export const PhoneInput = ({
  id,
  value,
  onChange,
  placeholder,
}: PhoneInputProps) => {
  const t = useTranslations('Profile.PhoneSection');
  const [preferredCountryCode, setPreferredCountryCode] = useState<
    string | null
  >(null);
  const [open, setOpen] = useState(false);

  const parsed = parseStoredPhoneNumber(value);
  const selectedCountry = resolveSelectedCountry(
    parsed.dialCode,
    preferredCountryCode,
  );

  const updatePhone = (nextDialCode: string, nextNationalNumber: string) => {
    const maxLength = getMaxNationalNumberLength(nextDialCode);
    const digits = nextNationalNumber.replace(/\D/g, '').slice(0, maxLength);
    onChange(formatPhoneNumber(nextDialCode, digits));
  };

  return (
    <div className="flex gap-2">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[132px] shrink-0 justify-between px-3"
          >
            <span className="truncate">
              {countryFlagEmoji(selectedCountry.code)}{' '}
              {selectedCountry.dialCode}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] p-0"
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <Command>
            <CommandInput placeholder={t('CountrySearch')} />
            <CommandList>
              <CommandEmpty>{t('CountryNotFound')}</CommandEmpty>
              <CommandGroup>
                {PHONE_COUNTRIES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={getCountrySearchValue(country)}
                    onSelect={() => {
                      setPreferredCountryCode(country.code);
                      updatePhone(country.dialCode, parsed.nationalNumber);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCountry.code === country.code
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <span className="mr-2">
                      {countryFlagEmoji(country.code)}
                    </span>
                    <span className="truncate">{country.name}</span>
                    <span className="ml-auto text-muted-foreground">
                      {country.dialCode}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={parsed.nationalNumber}
        maxLength={getMaxNationalNumberLength(selectedCountry.dialCode)}
        placeholder={placeholder}
        onChange={(event) => {
          updatePhone(selectedCountry.dialCode, event.target.value);
        }}
      />
    </div>
  );
};
