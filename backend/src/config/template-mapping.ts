import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  if (metadata['Do you provide regulated services?'] === 'yes') {
    if (
      [
        'AT',
        'CZ',
        'DE',
        'IT',
        'MT',
        'RO',
        'BE',
        'DK',
        'GR',
        'LV',
        'NL',
        'SK',
        'BG',
        'EE',
        'HU',
        'LI',
        'NO',
        'SI',
        'HR',
        'FI',
        'IS',
        'LT',
        'PL',
        'ES',
        'CY',
        'FR',
        'IE',
        'LU',
        'PT',
        'SE',
      ].includes(company.country)
    ) {
      return process.env.TEMPLATE_EEA;
    } else {
      return process.env.TEMPLATE_NO_EEA;
    }
  } else {
    return process.env.TEMPLATE_ID;
  }
};
