import { CustomField } from '../types';

// @deprecated
// To apply a specific design on the Checks list and card
export const hasKyb = true;

export const stepsConfig: {
  key: string;
  fields?: CustomField[];
  // Only for individuals_list step
  hasApplicant?: boolean;
  // Only for pdf_viewer step
  pdfUrl?: string;
}[] = [
  {
    key: 'disclaimer',
  },
  {
    key: 'disclaimer2',
  },
  {
    key: 'are_you',
    fields: [
      {
        id: 'are_you',
        isRequired: true,
        type: 'checkbox',
        options: ['an_exchange_platform', 'a_token_issuer', 'other'],
      },
      {
        id: 'are_you_other',
        isRequired: false,
      },
    ],
  },
  {
    key: 'company_search',
  },
  {
    key: 'company_list',
  },
  {
    key: 'company_edit',
  },
  {
    key: 'company_additional_data',
    fields: [
      {
        id: 'business_address',
        isRequired: false,
        hasHelper: true,
      },
      {
        id: 'activity',
        isRequired: true,
      },
      {
        id: 'business_jurisdictions',
        isRequired: true,
      },
      {
        id: 'customer_jurisdictions',
        isRequired: true,
      },
      {
        id: 'subject_to_aml_cft',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no'],
      },
      {
        id: 'aml_cft_supervisor',
        isRequired: false,
      },
    ],
  },
  {
    key: 'individuals_list',
    hasApplicant: true,
  },
  {
    key: 'individual_additional_data',
    fields: [
      {
        id: 'customer_type',
        isRequired: true,
        type: 'select',
        options: [
          'Private individual',
          'Private entity (not a personal asset holding vehicles)',
          'Private entity (personal asset holding vehicles)',
          'Regulated financial institution',
          'Publicly traded with 51% or more shares traded',
          'Shares are listed on a regulated market in the EEA or an equivalent regulated market outside of the EEA  or the entity is 100% subsidiary of a company that meets the aforementioned condition',
          'Government or State Owned',
          'Trusts/Foundations',
          'Other',
        ],
      },
      {
        id: 'customer_type_other',
        isRequired: false,
      },
      {
        id: 'company_have_nominee_shareholders',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no'],
      },
      {
        id: 'business_relationship_capacity',
        isRequired: true,
        type: 'radio',
        options: ['Principal to principal', 'On behalf of your customers'],
      },
      {
        id: 'criminality',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no'],
      },
    ],
  },
  {
    key: 'individual_pep',
    fields: [
      {
        id: 'pep',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no'],
      },
      {
        id: 'pep_name_function_jurisdictions',
        isRequired: false,
        hasHelper: true,
      },
    ],
  },
  {
    key: 'business_relationship',
    fields: [
      {
        id: 'keyrock_relationship',
        isRequired: true,
        type: 'select',
        options: [
          "I have been contacted by Keyrock's team",
          'I solicited Keyrock',
          'I have been introduced to Keyrock via a third party',
        ],
      },
      {
        id: 'keyrock_introduced_third_party',
        isRequired: false,
      },
      {
        id: 'purpose_of_your_business_relationship',
        isRequired: true,
        hasHelper: true,
        type: 'checkbox',
        options: [
          'Market Making crypto/crypto',
          'Market Making fiat/crypto',
          'OTC crypto/crypto',
          'OTC fiat/crypto',
          'OEX crypto/crypto',
          'OEX fiat/crypto',
        ],
      },
      {
        id: 'currencies',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'volume_of_transactions',
        isRequired: true,
        type: 'select',
        options: [
          '< 500K Eur',
          'Between 500K Eur and 3M Eur',
          '>3M Eur',
          'N/A',
        ],
      },
      {
        id: 'source_of_funds',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'fiat_send_deposit',
        isRequired: true,
      },
      {
        id: 'crypto_send_deposit',
        isRequired: true,
      },
      {
        id: 'wallet',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'fireblocks_network_id',
        isRequired: false,
      },
      {
        id: 'signet_id',
        isRequired: false,
      },
      {
        id: 'authorised_traders',
        isRequired: false,
      },
      {
        id: 'telegram_handles',
        isRequired: false,
      },
      {
        id: 'email_for_trade_confirmation',
        isRequired: false,
        type: 'email',
      },
    ],
  },
  {
    key: 'anti_money_laundering_program',
    fields: [
      {
        id: 'company_supporting_process',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no', 'n/a'],
      },
      {
        id: 'company_perform_customers_due_diligence',
        isRequired: true,
        type: 'radio',
        options: ['yes', 'no', 'n/a'],
      },
    ],
  },
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://acme.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];
