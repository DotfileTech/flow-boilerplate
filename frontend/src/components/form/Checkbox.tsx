import {
  CheckboxGroup,
  Checkbox as ChakraCheckbox,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type CheckboxProps = {
  stepId: string;
  name: string;
  onChange: any;
  options: string[];
  defaultValue: string[];
};

const Checkbox = (props: CheckboxProps) => {
  const { stepId, name, onChange, options, defaultValue } = props;

  const { t } = useTranslation();

  return (
    <CheckboxGroup defaultValue={defaultValue} onChange={onChange}>
      <VStack spacing="5" alignItems="start">
        {options.map((option: string) => (
          <ChakraCheckbox key={option} value={option}>
            {t(`steps.${stepId}.${name}.options.${option}`)}
          </ChakraCheckbox>
        ))}
      </VStack>
    </CheckboxGroup>
  );
};

export default Checkbox;
