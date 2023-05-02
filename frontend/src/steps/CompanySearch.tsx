import { useState, useEffect } from 'react';
import { InputGroup, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import CountrySelect from '../components/CountrySelect';

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
      props.company.country &&
      !props.autoSearchDone
    ) {
      props.getCompanies();
    }
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
      <CountrySelect
        stepId="company_search"
        defaultValue={props.company?.country || ''}
        onChange={props.changeHandler}
        name="country"
        countries={props.countries}
        isRequired
      />

      <InputGroup size="md">
        <InputForm
          stepId="company_search"
          type="text"
          isRequired
          defaultValue={props.company?.name || ''}
          onChange={props.changeHandler}
          name="name"
        />
      </InputGroup>

      <Box>
        <Button
          variant="next"
          rightIcon={<ChevronRightIcon size={16} />}
          isLoading={props.isLoading}
          onClick={props.getCompanies}
          isDisabled={!formValid}
        >
          {t('steps.company_search.button')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CompanySearch;
