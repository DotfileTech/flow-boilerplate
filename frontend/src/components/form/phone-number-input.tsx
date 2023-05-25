import { useCallback } from 'react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryCode } from 'libphonenumber-js/types';
import { Container } from './styles';

type PhoneNumberInputProps = {
  onChange?: (phoneNumber: string) => void;
  onBlur?: () => void;
  value?: string;
  defaultCountryCode?: CountryCode;
};

export const PhoneNumberInput = ({
  onChange,
  value,
  defaultCountryCode = 'FR',
}: PhoneNumberInputProps): JSX.Element => {
  const [phoneNumber, setState] = useState('');

  const handleOnChange = useCallback(
    (phoneNumber: string) => {
      onChange && onChange(`+${phoneNumber}`);
      setState(phoneNumber);
    },
    [onChange]
  );

  return (
    <Container>
      <PhoneInput
        country={
          // We must force the type because countryCode is type as a string in 'react-phone-input-2'
          defaultCountryCode && defaultCountryCode.toLowerCase().toString()
        }
        dropdownClass="dropDown"
        inputClass="input"
        buttonClass="button"
        value={value ?? phoneNumber}
        onChange={(phoneNumber, country) => {
          if ('countryCode' in country) {
            handleOnChange(phoneNumber);
          }
        }}
      />
    </Container>
  );
};
