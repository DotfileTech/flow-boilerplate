import { useState, useEffect } from 'react';
import { InputGroup, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/form/InputForm';
import CountrySelect from '../components/form/CountrySelect';
import { Country } from '../types';

const schema = Joi.object()
  .keys({
    country: Joi.string().required(),
    name: Joi.string().required(),
  })
  .unknown(true);

type CompanySearchProps = {
  countries: Country[];
  company: {
    name: string | null;
    country: string | null;
    registration_number: string | null;
  };
  getCompanies: () => void;
  isLoading: boolean;
  autoSearchDone: boolean;
  onChange: any;
};

const CompanySearch = (props: CompanySearchProps) => {
  const {
    countries,
    company,
    getCompanies,
    isLoading,
    autoSearchDone,
    onChange,
  } = props;

  const { t } = useTranslation();

  const [formValid, setFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (
      (company.name || company.registration_number) &&
      company.country &&
      !autoSearchDone
    ) {
      getCompanies();
    }
  }, []);

  useEffect(() => {
    const check = schema.validate(company);

    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [company, schema]);

  return (
    <Stack spacing={5} pt={2}>
      <CountrySelect
        stepId="company_search"
        defaultValue={company?.country || ''}
        onChange={onChange}
        name="country"
        countries={countries}
        isRequired
      />

      <InputGroup size="md">
        <InputForm
          stepId="company_search"
          type="text"
          isRequired
          defaultValue={company?.name || ''}
          onChange={onChange}
          name="name"
        />
      </InputGroup>

      <Box>
        <Button
          variant="next"
          rightIcon={<ChevronRightIcon size={16} />}
          isLoading={isLoading}
          onClick={getCompanies}
          isDisabled={!formValid}
        >
          {t('steps.company_search.button')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CompanySearch;
