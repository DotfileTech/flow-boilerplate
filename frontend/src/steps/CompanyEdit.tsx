import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import CountrySelect from '../components/CountrySelect';
import { companyData } from '../config/Company';
import Select from '../components/Select';

const CompanyEdit = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = companyData
    .filter((company) => company.enabled)
    .reduce((acc, cur) => {
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
      }

      return { ...acc, [cur.id]: schema };
    }, {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const { address, banking_information, ...data } = props.company;
    let values = data;
    if (address) {
      values = { ...address, ...values };
    }
    if (banking_information) {
      values = { ...banking_information, ...values };
    }

    const check = schema.validate(values);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [props.company, schema]);

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {companyData
          .filter((company) => company.enabled)
          .map((company: any) => {
            const defaultValue = company.nested
              ? props.company[company.nested]
                ? props.company[company.nested][company.id]
                : ''
              : props.company[company.id];

            if (company.type === 'select') {
              return (
                <Select
                  key={`company_${company.id}`}
                  stepId="company_edit"
                  name={company.id}
                  defaultValue={defaultValue || ''}
                  isRequired={company.required}
                  options={company.options || []}
                  onChange={(e: any) => props.changeHandler(e, company.nested)}
                />
              );
            }

            if (company.type === 'country') {
              return (
                <CountrySelect
                  key={`company_${company.id}`}
                  stepId="company_edit"
                  defaultValue={defaultValue || props.company.country || ''}
                  onChange={props.changeHandler}
                  name={company.id}
                  countries={props.countries}
                  isRequired={company.required}
                />
              );
            }

            return (
              <InputForm
                key={company.id}
                stepId="company_edit"
                defaultValue={defaultValue || ''}
                onChange={(e: any) => props.changeHandler(e, company.nested)}
                name={company.id}
                isRequired={company.required}
                type={company.type}
              />
            );
          })}

        <Box>
          <Button variant="next" onClick={props.next} isDisabled={!formValid}>
            {t('domain.form.next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default CompanyEdit;
