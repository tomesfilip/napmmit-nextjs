import {
  getLegalPrivacyUrl,
  getLegalTermsUrl,
  LEGAL_OPERATOR_NAME,
  TERMS_EFFECTIVE_DATE,
} from './legal-constants';

export type ReservationConfirmationLegalCopy = {
  title: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export function getReservationConfirmationLegalCopy(): ReservationConfirmationLegalCopy {
  return {
    title: 'Obchodné podmienky a dôležité informácie',
    sections: [
      {
        heading: 'Prevádzkovateľ platformy',
        paragraphs: [
          `${LEGAL_OPERATOR_NAME} prevádzkuje platformu Napmmit ako sprostredkovateľa rezervácií horských chát. Napmmit nie je poskytovateľom ubytovania ani zmluvnou stranou pobytu medzi hosťom a majiteľom chaty.`,
        ],
      },
      {
        heading: 'Životný cyklus rezervácie',
        paragraphs: [
          'Po úspešnej online platbe rezervačného poplatku je rezervácia uložená so stavom čakajúca na potvrdenie majiteľom chaty. Majiteľ chaty môže rezerváciu potvrdiť alebo zrušiť podľa dostupnosti a prevádzkových pravidiel chaty.',
        ],
      },
      {
        heading: 'Storno a vrátenie rezervačného poplatku',
        paragraphs: [
          'Hosť môže zrušiť rezerváciu najneskôr 48 hodín pred začiatkom pobytu. Pri oprávnenom storne hosťa môže byť vrátená časť rezervačného poplatku vo výške 0,50 €, ak to platobná situácia a stav rezervácie umožňujú.',
          'Platba za samotné ubytovanie prebieha priamo medzi hosťom a majiteľom chaty, pokiaľ produktová politika neurčí inak.',
        ],
      },
      {
        heading: 'Obmedzenie zodpovednosti',
        paragraphs: [
          'Napmmit nezodpovedá za kvalitu ubytovania, dostupnosť chaty ani za priame zmluvné vzťahy medzi hosťom a majiteľom chaty. Zodpovednosť platformy je obmedzená v rozsahu uvedenom vo všeobecných obchodných podmienkach platných od ' +
            TERMS_EFFECTIVE_DATE +
            '.',
        ],
      },
      {
        heading: 'Rozhodné právo a odkazy',
        paragraphs: [
          'Tieto podmienky sa riadia právnym poriadkom Slovenskej republiky.',
          `Úplné znenie obchodných podmienok: ${getLegalTermsUrl()}`,
          `Zásady ochrany osobných údajov: ${getLegalPrivacyUrl()}`,
        ],
      },
    ],
  };
}
