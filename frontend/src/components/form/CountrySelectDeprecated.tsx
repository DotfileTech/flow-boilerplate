import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Country } from '../../types';

type CountrySelectDeprecatedProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  isRequired: boolean;
  hasHelper?: boolean;
  onChange: any;
  countries: Country[];
};

const CountrySelectDeprecated = (props: CountrySelectDeprecatedProps) => {
  const {
    stepId,
    name,
    defaultValue,
    isRequired,
    hasHelper = false,
    onChange,
    countries,
  } = props;

  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        {t(`steps.${stepId}.${name}.label`)}
      </FormLabel>
      {hasHelper && (
        <FormHelperText mt="0" mb="2">
          {t(`steps.${stepId}.${name}.helper`)}
        </FormHelperText>
      )}
      <Select
        defaultValue={defaultValue}
        onChange={onChange}
        name={name}
        maxW="400px"
      >
        <option hidden disabled value="">
          {t('domain.form.select')}
        </option>
        {countries.map((country: Country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default CountrySelectDeprecated;
