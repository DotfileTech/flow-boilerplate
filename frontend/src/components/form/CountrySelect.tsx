import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Country } from '../../types';
import { COUNTRIES } from '../../constants/all-iso31661-alpha2-codes.constant';

type CountrySelectProps = {
  onChange: any;
  countries?: Country[];
  defaultValue: string;
};

const CountrySelect = (props: CountrySelectProps) => {
  const { onChange, countries, defaultValue } = props;

  const { t } = useTranslation();

  const countryList =
    countries && countries?.length > 0 ? countries : COUNTRIES;

  return (
    <Select
      defaultValue={defaultValue}
      onChange={(ev) => onChange(ev.target.value)}
      maxW="400px"
    >
      <option hidden disabled value="">
        {t('domain.form.select')}
      </option>
      {countryList.map((country: Country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </Select>
  );
};

export default CountrySelect;
