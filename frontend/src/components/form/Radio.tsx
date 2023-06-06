import { RadioGroup, Radio as ChakraRadio, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type RadioProps = {
  stepId: string;
  name: string;
  defaultValue: string;
  options: string[];
  onChange: any;
};

const Radio = (props: RadioProps) => {
  const { stepId, name, defaultValue, options, onChange } = props;

  const { t } = useTranslation();

  return (
    <RadioGroup
      onChange={(value) => onChange(value)}
      name={name}
      defaultValue={defaultValue}
    >
      <VStack spacing="5" alignItems="start">
        {options.map((option: string) => (
          <ChakraRadio key={option} value={option}>
            {t(`steps.${stepId}.${name}.options.${option}`)}
          </ChakraRadio>
        ))}
      </VStack>
    </RadioGroup>
  );
};

export default Radio;
