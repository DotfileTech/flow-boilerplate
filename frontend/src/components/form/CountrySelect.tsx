import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
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

  const resolvedDefaultValue = useMemo(() => {
    if (typeof defaultValue === 'string') {
      return COUNTRIES.find((o) => o.value === (defaultValue as unknown));
    } else {
      return defaultValue;
    }
  }, [defaultValue]);

  const chakraStyles: ChakraStylesConfig = {
    container: (provided) => ({
      ...provided,
      maxW: '400px',
    }),
  };

  return (
    <Select
      placeholder={t('domain.form.select')}
      useBasicStyles
      chakraStyles={chakraStyles}
      defaultValue={resolvedDefaultValue}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options={countryList}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onChange={(option) => onChange(option.value)}
    />
  );
};

export default CountrySelect;
