import { useMemo } from 'react';
import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import Checkbox from '../components/form/Checkbox';
import { individualData } from '../config/Individual';
import { Individual, Field } from '../types';
import CountrySelect from '../components/form/CountrySelect';
import { GroupController } from '../components/form/group-controller';
import { IndividualEditFormValues } from './utils';
import { individualSchema } from './validation/individual.schema';

type IndividualEditProps = {
  individual: Omit<Individual, 'id' | 'checks'>;
  onChange: (values: Omit<Individual, 'id' | 'checks'>) => void;
};

const IndividualEdit = (props: IndividualEditProps) => {
  const { individual, onChange } = props;

  const { t } = useTranslation();

  const defaultValues = useMemo(() => {
    const defaultValues: IndividualEditFormValues = {
      first_name: individual.first_name || '',
      last_name: individual.last_name || '',
      email: individual.email || '',
      roles: individual.roles || [],
      birth_date: individual.birth_date || '',
      birth_country: individual.birth_country || '',
      birth_place: individual.birth_place || '',
      address: {
        street_address: individual.address?.street_address || '',
        street_address_2: individual.address?.street_address_2 || '',
        postal_code: individual.address?.postal_code || '',
        city: individual.address?.city || '',
        country: individual.address?.country || '',
      },
      banking_information: {
        iban: individual.banking_information?.iban || '',
        bic: individual.banking_information?.bic || '',
      },
      tax_identification_number: individual.tax_identification_number || '',
      social_security_number: individual.social_security_number || '',
      phone_number: individual.phone_number || '',
      position: individual.position || '',
      ownership_percentage: individual.ownership_percentage || null,
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
    control,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<IndividualEditFormValues> = async (
    formData
  ) => {
    onChange(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" alignItems="start">
        {individualData
          .filter((field) => field.enabled)
          .map((field: Field) => {
            if (field.type === 'checkbox') {
              return (
                <GroupController
                  key={
                    field.nested
                      ? `individual_${field.nested}_${field.id}`
                      : `individual_${field.id}`
                  }
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  name={field.nested ? `${field.nested}.${field.id}` : field.id}
                  label={
                    t(`steps.individual_edit.${field.id}.label`) + ' *' ||
                    field.id
                  }
                  helper={
                    field.hasHelper
                      ? t(`steps.individual_edit.${field.id}.helper`)
                      : null
                  }
                  isRequired={field.required}
                  defaultValue="false"
                  control={control}
                  render={(f) => {
                    return (
                      <Checkbox
                        stepId="individual_edit"
                        name={field.id}
                        onChange={(values: any) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          setValue(field.id, values, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        options={field.options || []}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        defaultValue={f.value}
                      />
                    );
                  }}
                />
              );
            }

            if (field.type === 'country') {
              return (
                <GroupController
                  key={
                    field.nested
                      ? `individual_${field.nested}_${field.id}`
                      : `individual_${field.id}`
                  }
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  name={field.nested ? `${field.nested}.${field.id}` : field.id}
                  label={
                    t(`steps.individual_edit.${field.id}.label`) || field.id
                  }
                  helper={
                    field.hasHelper
                      ? t(`steps.individual_edit.${field.id}.helper`)
                      : null
                  }
                  isRequired={field.required}
                  control={control}
                  render={(f) => (
                    <CountrySelect
                      onChange={(value: string) => {
                        setValue(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          field.nested
                            ? `${field.nested}.${field.id}`
                            : field.id,
                          value ?? '',
                          {
                            shouldDirty: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      defaultValue={f.value}
                    />
                  )}
                />
              );
            }

            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.nested ? `${field.nested}.${field.id}` : field.id}
                label={t(`steps.individual_edit.${field.id}.label`) || field.id}
                helper={
                  field.hasHelper
                    ? t(`steps.individual_edit.${field.id}.helper`)
                    : null
                }
                isRequired={field.required}
                //hasHelper={field.hasHelper}
                control={control}
                render={(f) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  return (
                    <Input
                      type={field.type}
                      maxW="400px"
                      {...f}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      value={f.value ?? ''}
                    />
                  );
                }}
              />
            );
          })}
        <Box>
          <Button
            variant="next"
            isLoading={isSubmitting}
            isDisabled={!isValid}
            type="submit"
          >
            {t('domain.form.save')}
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default IndividualEdit;
