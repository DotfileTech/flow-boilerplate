import { FormData } from '../types';

export const form: FormData[] = [
  {
    key: 'disclaimer',
    fields: [],
  },
  {
    key: 'company_details',
    after: 'company_edit',
    fields: [
      {
        id: 'trade_registry_location',
        isRequired: true,
      },
    ],
  },
];
