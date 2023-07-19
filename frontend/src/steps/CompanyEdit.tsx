import { useMemo } from 'react';
import { Button, Box, Input, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { companyData } from '../config/Company';
import { Company, Field } from '../types';
import Select from '../components/form/Select';
import { GroupController } from '../components/form/group-controller';
import CountrySelect from '../components/form/CountrySelect';
import { CompanyEditFormValues } from './utils';
import { companySchema } from './validation/company.schema';

type CompanyEditProps = {
  company: Omit<Company, 'id' | 'checks'>;
  onChange: (values: Omit<Company, 'id' | 'checks'>) => void;
  next: (() => void) | null;
};

const CompanyEdit = (props: CompanyEditProps) => {
  const { company, onChange, next } = props;

  const { t } = useTranslation();

  const defaultValues = useMemo(() => {
    const defaultValues: CompanyEditFormValues = {
      name: company.name || '',
      commercial_name: company.commercial_name || '',
      registration_number: company.registration_number || '',
      country: company.country || '',
      legal_form: company.legal_form || '',
      status: company.status || '',
      registration_date: company.registration_date || '',
      address: {
        street_address: company.address?.street_address || '',
        street_address_2: company.address?.street_address_2 || '',
        postal_code: company.address?.postal_code || '',
        city: company.address?.city || '',
        country: company.address?.country || '',
      },
      banking_information: {
        iban: company.banking_information?.iban || '',
        bic: company.banking_information?.bic || '',
      },
      tax_identification_number: company.tax_identification_number || '',
      employer_identification_number:
        company.employer_identification_number || '',
      classifications: company.classifications
        ? [
            {
              code: company.classifications[0]?.code || '',
              description: company.classifications[0]?.description || '',
            },
          ]
        : [],
    };

    return defaultValues;
  }, [company]);

  const methods = useForm<CompanyEditFormValues>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(companySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<CompanyEditFormValues> = async (formData) => {
    onChange(formData);
    if (next) {
      next();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {companyData.map((field: Field) => {
        if (!field.enabled) {
          return (
            <GroupController
              key={field.id}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={
                field.nested
                  ? field.nested === 'classifications'
                    ? `${field.nested}.0.${field.id}`
                    : `${field.nested}.${field.id}`
                  : field.id
              }
              isRequired={false}
              control={control}
              render={(f) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return <Input type="hidden" maxW="400px" {...f} />;
              }}
            />
          );
        }

        if (field.type === 'select') {
          return (
            <GroupController
              key={
                field.nested
                  ? `company_${field.nested}_${field.id}`
                  : `company_${field.id}`
              }
              mb="6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.nested ? `${field.nested}.${field.id}` : field.id}
              label={t(`steps.company_edit.${field.id}.label`) || field.id}
              helper={
                field.hasHelper
                  ? t(`steps.company_edit.${field.id}.helper`)
                  : null
              }
              isRequired={field.required}
              control={control}
              render={(f) => (
                <Select
                  stepId="company_edit"
                  name={field.id}
                  onChange={(value: string) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setValue(field.id, value ?? '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  options={field.options || []}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  defaultValue={f.value}
                />
              )}
            />
          );
        }

        if (field.type === 'country') {
          return (
            <GroupController
              key={
                field.nested
                  ? `company_${field.nested}_${field.id}`
                  : `company_${field.id}`
              }
              mb="6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.nested ? `${field.nested}.${field.id}` : field.id}
              label={t(`steps.company_edit.${field.id}.label`) || field.id}
              helper={
                field.hasHelper
                  ? t(`steps.company_edit.${field.id}.helper`)
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
                      field.nested ? `${field.nested}.${field.id}` : field.id,
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
          <Box w="100%" key={field.id} mb="6">
            {field.nested &&
              t(`steps.company_edit.nested.${field.nested}`) !== '' &&
              (field.id === 'code' ||
                field.id === 'street_address' ||
                field.id === 'iban') && (
                <Heading
                  pt="5"
                  pb="2"
                  fontWeight={600}
                  color="brand.main-3"
                  fontSize={{ base: 'xl', md: '2xl' }}
                >
                  {t(`steps.company_edit.nested.${field.nested}`)}
                </Heading>
              )}
            <GroupController
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={
                field.nested
                  ? field.nested === 'classifications'
                    ? `${field.nested}.0.${field.id}`
                    : `${field.nested}.${field.id}`
                  : field.id
              }
              label={t(`steps.company_edit.${field.id}.label`) || field.id}
              helper={
                field.hasHelper
                  ? t(`steps.company_edit.${field.id}.helper`)
                  : null
              }
              isRequired={field.required}
              control={control}
              render={(f) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return <Input type={field.type} maxW="400px" {...f} />;
              }}
            />
          </Box>
        );
      })}

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
    </form>
  );
};

export default CompanyEdit;
