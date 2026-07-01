import { describe, expect, it } from 'vitest';
import { getReservationConfirmationLegalCopy } from './reservation-confirmation-legal-copy';

describe('getReservationConfirmationLegalCopy', () => {
  it('returns required legal sections and headings', () => {
    const copy = getReservationConfirmationLegalCopy();

    expect(copy.title).toBeTruthy();
    expect(copy.sections.length).toBeGreaterThanOrEqual(4);

    const headings = copy.sections.map((section) => section.heading);
    expect(headings).toContain('Prevádzkovateľ platformy');
    expect(headings).toContain('Storno a vrátenie rezervačného poplatku');
    expect(headings).toContain('Rozhodné právo a odkazy');

    const governingLawSection = copy.sections.find(
      (section) => section.heading === 'Rozhodné právo a odkazy',
    );
    expect(
      governingLawSection?.paragraphs.some((paragraph) =>
        paragraph.includes('Slovenskej republiky'),
      ),
    ).toBe(true);
  });
});
