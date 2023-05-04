import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/form/InputForm';
import CountrySelect from '../components/form/CountrySelect';
import { companyData } from '../config/Company';
import Select from '../components/form/Select';
import { Country, Field } from '../types';

type CompanyEditProps = {
  countries: Country[];
  company: any;
  onChange: (e: any, nested: string | undefined) => void;
  next: () => void;
};

const CompanyEdit = (props: CompanyEditProps) => {
  const { company, onChange, next, countries } = props;

  const { t } = useTranslation();
  const [formValid, setFormValid] = useState<boolean>(false);

  const rules = companyData
    .filter((field: Field) => field.enabled)
    .reduce((acc, cur: Field) => {
      let schema;

      switch (cur.type) {
        case 'url':
          schema = Joi.string().empty('').uri();
          break;
        case 'date':
          schema = Joi.date();
          break;
        default:
          schema = Joi.string().empty('');
      }

      switch (cur.id) {
        case 'iban':
          schema = schema.min(15);
          break;
        case 'bic':
          schema = schema.min(8);
          break;
      }

      if (cur.required) {
        schema = schema.required();
      } else {
        schema = schema.allow(null);
      }

      return { ...acc, [cur.id]: schema };
    }, {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const { address, banking_information, classifications, ...data } = company;
    let values = data;
    if (address) {
      values = { ...address, ...values };
    }
    if (banking_information) {
      values = { ...banking_information, ...values };
    }
    if (classifications && classifications.length > 0) {
      values = { ...classifications[0], ...values };
    }

    const check = schema.validate(values);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [company, schema]);

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {companyData
          .filter((field: Field) => field.enabled)
          .map((field: Field) => {
            let defaultValue = '';

            if (company[field.id]) {
              defaultValue = company[field.id];
            }

            if (field.nested && company[field.nested]) {
              defaultValue = company[field.nested][field.id];
            }

            if (
              field.nested === 'classifications' &&
              company[field.nested] &&
              company[field.nested].length > 0
            ) {
              defaultValue = company[field.nested][0][field.id];
            }

            if (field.type === 'select') {
              return (
                <Select
                  key={`company_${field.id}`}
                  stepId="company_edit"
                  name={field.id}
                  defaultValue={defaultValue || ''}
                  isRequired={field.required}
                  options={field.options || []}
                  onChange={(e: any) => onChange(e, field.nested)}
                />
              );
            }

            if (field.type === 'country') {
              return (
                <CountrySelect
                  key={`company_${field.id}`}
                  stepId="company_edit"
                  defaultValue={defaultValue || company.country || ''}
                  onChange={onChange}
                  name={field.id}
                  countries={countries}
                  isRequired={field.required}
                />
              );
            }

            return (
              <InputForm
                key={field.id}
                stepId="company_edit"
                defaultValue={defaultValue || ''}
                onChange={(e: any) => onChange(e, field.nested)}
                name={field.id}
                isRequired={field.required}
                type={field.type}
              />
            );
          })}

        <Box>
          <Button variant="next" onClick={next} isDisabled={!formValid}>
            {t('domain.form.next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default CompanyEdit;
