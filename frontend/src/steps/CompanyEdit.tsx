import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import SelectFloatingLabel from '../components/SelectFloatingLabel';
import { companyData } from '../config/Company';

const CompanyEdit = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = companyData
    .filter((company) => company.required && company.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const check = schema.validate(props.company);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [props.company, schema]);

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        <SelectFloatingLabel
          value={props.company ? props.company.country : ''}
          onChange={props.changeHandler}
          name="country"
          isRequired
          placeholder="Country"
          countries={props.countries}
        />

        {companyData
          .filter((company) => company.enabled)
          .map((company: any) => (
            <InputForm
              key={company.id}
              value={props.company[company.id]}
              onChange={props.changeHandler}
              name={company.id}
              isRequired={company.required}
              type={company.type}
            />
          ))}

        <Box>
          <Button variant="next" onClick={props.next} isDisabled={!formValid}>
            {t('next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
}

export default CompanyEdit;
