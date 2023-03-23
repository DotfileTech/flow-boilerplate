export const form = [
  {
    key: 'additional_data',
    after: 'company_search',
    questions: [
      {
        id: 'activity',
        label: 'Your company activity',
        required: true,
        enabled: true,
      },
      {
        id: 'turnover',
        label: 'Last year turnover (in euros)',
        required: true,
        enabled: true,
      },
      {
        id: 'funds',
        label: 'Source of the funds',
        required: true,
        enabled: true,
      },
      {
        id: 'deposits',
        label: 'Estimated generated deposits on your Nilos account (monthly)',
        required: true,
        enabled: true,
      },
    ],
  },
  {
    key: 'additional_data2',
    after: 'additional_data1',
    questions: [
      {
        id: 'activity',
        label: 'Your company activity',
        required: true,
        enabled: true,
      },
      {
        id: 'turnover',
        label: 'Last year turnover (in euros)',
        required: true,
        enabled: true,
      },
      {
        id: 'funds',
        label: 'Source of the funds',
        required: true,
        enabled: true,
      },
      {
        id: 'deposits',
        label: 'Estimated generated deposits on your Nilos account (monthly)',
        required: true,
        enabled: true,
      },
    ],
  },
]
