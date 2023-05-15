import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Country } from '../../types';

type CountrySelectProps = {
  onChange: any;
  countries: Country[];
  defaultValue: string;
};

const CountrySelect = (props: CountrySelectProps) => {
  const { onChange, countries, defaultValue } = props;

  const { t } = useTranslation();

  return (
    <Select
      defaultValue={defaultValue}
      onChange={(ev) => onChange(ev.target.value)}
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
  );
};

export default CountrySelect;
