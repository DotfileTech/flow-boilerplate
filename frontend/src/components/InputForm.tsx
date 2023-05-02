import { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';

type InputFormProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  isRequired: boolean;
  hasHelper?: boolean;
  type?: 'text' | 'date' | 'number' | 'url' | 'email' | 'tel';
  onChange: any;
};

const InputForm = (props: InputFormProps) => {
  const {
    stepId,
    name,
    defaultValue,
    isRequired,
    hasHelper = false,
    type = 'text',
    onChange,
  } = props;

  const { t } = useTranslation();

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  let schema: any;

  switch (type) {
    case 'email':
      schema = Joi.string()
        .empty('')
        .email({ tlds: { allow: false } });
      break;
    case 'tel':
      schema = Joi.string()
        .empty('')
        .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/);
      break;
    case 'url':
      schema = Joi.string().empty('').uri();
      break;
    case 'number':
      schema = Joi.number();
      break;
    case 'date':
      schema = Joi.date();
      break;
    default:
      schema = Joi.string().empty('');
  }

  switch (name) {
    case 'iban':
      schema = schema.min(15);
      break;
    case 'bic':
      schema = schema.min(8);
      break;
  }

  if (isRequired) {
    schema = schema.required();
  }

  const onBlur = () => {
    const check = schema.validate(defaultValue);
    setIsInvalid(!!check.error);
  };

  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel noOfLines={1}>{t(`steps.${stepId}.${name}.label`)}</FormLabel>
      {hasHelper && (
        <FormHelperText mt="0" mb="2">
          {t(`steps.${stepId}.${name}.helper`)}
        </FormHelperText>
      )}
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        maxW="400px"
      />
    </FormControl>
  );
};

export default InputForm;
