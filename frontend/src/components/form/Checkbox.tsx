import {
  CheckboxGroup,
  Checkbox as ChakraCheckbox,
  Stack,
  FormLabel,
  FormControl,
  FormHelperText,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type CheckboxProps = {
  stepId: string;
  name: string;
  defaultValue: string[];
  isRequired: boolean;
  hasHelper?: boolean;
  options: string[];
  onChange: any;
};

const Checkbox = (props: CheckboxProps) => {
  const {
    stepId,
    name,
    defaultValue,
    isRequired,
    hasHelper = false,
    options,
    onChange,
  } = props;

  const { t } = useTranslation();

  return (
    <FormControl>
      <FormLabel>
        {t(`steps.${stepId}.${name}.label`)}{' '}
        {isRequired && (
          <Text as="span" color="red.500">
            *
          </Text>
        )}
      </FormLabel>
      {hasHelper && (
        <FormHelperText mt="0" mb="2">
          {t(`steps.${stepId}.${name}.helper`)}
        </FormHelperText>
      )}
      <CheckboxGroup defaultValue={defaultValue}>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing="5">
          {options.map((option: string) => (
            <ChakraCheckbox key={option} value={option} onChange={onChange}>
              {t(`steps.${stepId}.${name}.options.${option}`)}
            </ChakraCheckbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
};

export default Checkbox;
