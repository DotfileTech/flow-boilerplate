import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import CountrySelect from '../components/CountrySelect';
import { companyData } from '../config/Company';

const CompanyEdit = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = companyData
    .filter((company) => company.required && company.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

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

            if (company.type === 'country') {
              return (
                <CountrySelect
                  key={`company_${company.id}`}
                  stepId="company_edit"
                  defaultValue={defaultValue || ''}
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
