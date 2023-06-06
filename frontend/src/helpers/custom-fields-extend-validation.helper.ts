import { useTranslation } from 'react-i18next';
import { CustomField } from '../types';

// Extend customFields with validation based on type
export const customFieldsExtendValidation = (
  fields: CustomField[],
  stepId?: string
) => {
  const { t } = useTranslation();

  return fields.map((field: CustomField) => {
    const f = {
      id: field.id,
      label: t(`steps.${stepId}.${field.id}.label`),
      type: field.type,
      required: field.isRequired,
    };

    const requiredFieldValidation = field.isRequired
      ? [
          {
            type: 'required',
            params: [],
          },
        ]
      : [
          {
            type: 'optional',
            params: [],
          },
          {
            type: 'nullable',
            params: [],
          },
          {
            type: 'default',
            params: [null],
          },
          {
            type: 'transform',
            params: [(v: any) => (v === '' ? null : v)],
          },
        ];

    switch (field.type) {
      case 'email':
        return {
          ...f,
          validationType: 'string',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'email',
              params: [],
            },
          ],
        };
      case 'url':
        return {
          ...f,
          validationType: 'string',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'url',
              params: [],
            },
          ],
        };
      case 'number':
        return {
          ...f,
          validationType: 'number',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'transform',
              params: [(v: any) => (isNaN(v) || v === '' ? null : v)],
            },
          ],
        };
      case 'tel':
        return {
          ...f,
          validationType: 'string',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'matches',
              params: [
                /^\+(?:[0-9] ?){6,14}[0-9]$/,
                'Phone number should follow international standard format',
              ],
            },
          ],
        };
      case 'radio':
        return {
          ...f,
          validationType: 'mixed',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'oneOf',
              params: [field.options],
            },
          ],
        };
      case 'select':
        return {
          ...f,
          validationType: 'mixed',
          validations: [
            ...requiredFieldValidation,
            {
              type: 'oneOf',
              params: [field.options],
            },
          ],
        };
      default:
        return {
          ...f,
          validationType: 'string',
          validations: [...requiredFieldValidation],
        };
    }
  });
};
