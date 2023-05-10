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
  {
    key: 'origin_funds',
    after: 'company_details',
    fields: [
      {
        id: 'origin_funds',
        type: 'select',
        isRequired: true,
        options: ['company_revenue', 'shareholder_contribution'],
      },
    ],
  },
];
