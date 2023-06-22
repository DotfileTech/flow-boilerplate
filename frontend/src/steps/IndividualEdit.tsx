import { useMemo } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { Individual } from '../types';
import { IndividualEditFormValues } from './utils';
import { individualSchema } from './validation/individual.schema';
import { IndividualRoleEnum } from '../constants';
import IndividualForm from '../components/IndividualForm';
import { useSearchParams } from 'react-router-dom';

type IndividualEditProps = {
  individual: Omit<Individual, 'id' | 'checks'> | null;
  onChange: (values: Omit<Individual, 'id' | 'checks'>) => void;
};

const IndividualEdit = (props: IndividualEditProps) => {
  const { individual, onChange } = props;

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const defaultValues = useMemo(() => {
    const defaultValues: IndividualEditFormValues = {
      first_name: individual?.first_name || searchParams.get('firstName') || '',
      middle_name: individual?.middle_name || '',
      last_name: individual?.last_name || searchParams.get('lastName') || '',
      maiden_name: individual?.maiden_name || '',
      email: individual?.email || searchParams.get('email') || '',
      roles: individual?.roles || [],
      birth_date: individual?.birth_date || '',
      birth_country: individual?.birth_country || '',
      birth_place: individual?.birth_place || '',
      address: {
        street_address: individual?.address?.street_address || '',
        street_address_2: individual?.address?.street_address_2 || '',
        postal_code: individual?.address?.postal_code || '',
        city: individual?.address?.city || '',
        country: individual?.address?.country || '',
      },
      banking_information: {
        iban: individual?.banking_information?.iban || '',
        bic: individual?.banking_information?.bic || '',
      },
      tax_identification_number: individual?.tax_identification_number || '',
      social_security_number: individual?.social_security_number || '',
      phone_number: individual?.phone_number || '',
      position: individual?.position || '',
      ownership_percentage: individual?.ownership_percentage || null,
    };

    return defaultValues;
  }, [individual]);

  const methods = useForm<IndividualEditFormValues>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(individualSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<IndividualEditFormValues> = async (
    formData
  ) => {
    onChange(formData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="6" alignItems="start">
          <IndividualForm
            isApplicant={
              individual?.roles?.includes(IndividualRoleEnum.applicant) || false
            }
          />
          <Box>
            <Button
              variant="next"
              isLoading={isSubmitting}
              isDisabled={!isValid}
              type="submit"
            >
              {t('domain.form.next')}
            </Button>
          </Box>
        </VStack>
      </form>
    </FormProvider>
  );
};

export default IndividualEdit;
