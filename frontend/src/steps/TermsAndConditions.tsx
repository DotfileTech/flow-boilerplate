import {
  Button,
  VStack,
  Box,
  Checkbox as ChakraCheckbox,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { GroupController } from '../components/form/group-controller';
import pdf from '../assets/terms-and-conditions.pdf';

type TermsAndConditionsProps = {
  metadata: { [key: string]: string | boolean | null };
  onChange: (values: any) => void;
  next: (() => void) | null;
};

interface FormValues {
  terms_and_conditions: boolean;
}

const validationSchema = Yup.object({
  terms_and_conditions: Yup.boolean().oneOf(
    [true],
    'You must accept the terms and conditions'
  ),
});

const TermsAndConditions = (props: TermsAndConditionsProps) => {
  const { metadata, onChange, next } = props;

  const { t } = useTranslation();

  const defaultValues: FormValues = {
    terms_and_conditions:
      metadata.terms_and_conditions &&
      typeof metadata.terms_and_conditions == 'boolean'
        ? metadata.terms_and_conditions
        : false,
  };

  const methods = useForm<FormValues>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    onChange(formData);

    if (next) {
      next();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" alignItems="start">
        <object data={pdf} type="application/pdf" width="100%" height="500px">
          <p>
            Unable to display PDF file. <a href={pdf}>Download</a> instead.
          </p>
        </object>
        <GroupController
          name="terms_and_conditions"
          isRequired={true}
          control={control}
          render={(f) => {
            return (
              <ChakraCheckbox
                defaultChecked={f.value}
                onChange={(e: any) => {
                  setValue('terms_and_conditions', e.target.checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                {t(`steps.terms_and_conditions.label`)}
              </ChakraCheckbox>
            );
          }}
        />

        <Box>
          <Button variant="next" isDisabled={!isValid} type="submit">
            {t('domain.form.next')}
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default TermsAndConditions;
