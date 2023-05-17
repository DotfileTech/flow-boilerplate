import { FormData } from '../types';

export const form: FormData[] = [
  {
    key: 'additional_data',
    after: 'company_edit',
    fields: [
      {
        id: 'self_employed',
        type: 'radio',
        isRequired: true,
        options: ['yes', 'no'],
      },
    ],
  },
];
