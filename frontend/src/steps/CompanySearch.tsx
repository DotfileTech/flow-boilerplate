import { useState, useEffect } from 'react';
import { InputGroup, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import SelectFloatingLabel from '../components/SelectFloatingLabel';

const CompanySearch = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const schema = Joi.object()
    .keys({
      country: Joi.string().required(),
      name: Joi.string().required(),
    })
    .unknown(true);

  useEffect(() => {
    if (
      (props.company.name || props.company.registration_number) &&
      props.company.country && !props.autoSearchDone
    ) {
      props.getCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <SelectFloatingLabel
        value={props.company ? props.company.country : ''}
        isRequired
        onChange={props.changeHandler}
        name="country"
        countries={props.countries}
      />

      <InputGroup size="md">
        <InputForm
          pr="4.5rem"
          type="text"
          isRequired
          value={props.company ? props.company.name : ''}
          onChange={props.changeHandler}
          name="name"
        />
      </InputGroup>

      <Box>
        <Button
          variant="next"
          rightIcon={<ChevronRightIcon />}
          isLoading={props.isLoading}
          onClick={props.getCompanies}
          isDisabled={!formValid}
        >
          {t('search')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CompanySearch;
