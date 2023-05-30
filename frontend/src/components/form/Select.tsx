import { Select as ChakraSelect } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type SelectProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  options: string[];
  onChange: any;
  isTranslatableOptions?: boolean;
};

const Select = (props: SelectProps) => {
  const {
    stepId,
    name,
    defaultValue,
    options,
    onChange,
    isTranslatableOptions = true,
  } = props;

  const { t } = useTranslation();

  return (
    <ChakraSelect
      defaultValue={defaultValue}
      onChange={(ev) => onChange(ev.target.value)}
      maxW="400px"
    >
      <option hidden disabled value=""></option>
      {isTranslatableOptions
        ? options.map((option: string) => (
            <option key={option} value={option}>
              {t(`steps.${stepId}.${name}.options.${option}`)}
            </option>
          ))
        : options.map((option, i: number) => (
            <option key={i} value={i}>
              {option}
            </option>
          ))}
    </ChakraSelect>
  );
};

export default Select;
