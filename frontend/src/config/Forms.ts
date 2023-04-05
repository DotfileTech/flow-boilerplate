export const form = [
  {
    key: 'company_structure',
    type: 'radio',
    choices: [
      'private_company',
      'public_company',
      'association',
      'self_employed',
    ],
  },
  {
    key: 'additional_data',
    type: 'form',
    after: 'company_structure',
    questions: [
      {
        id: 'activity',
        required: true,
        enabled: true,
      },
      {
        id: 'turnover',
        required: true,
        enabled: true,
      },
      {
        id: 'funds',
        required: true,
        enabled: true,
      },
      {
        id: 'deposits',
        required: true,
        enabled: true,
      },
    ],
  },
]
