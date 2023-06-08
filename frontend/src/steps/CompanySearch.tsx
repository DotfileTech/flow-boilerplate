import { useState } from 'react';
import { Button, VStack, Box, Input } from '@chakra-ui/react';
import * as Yup from 'yup';
import { ChevronRightIcon, ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import CountrySelect from '../components/form/CountrySelect';
import { GroupController } from '../components/form/group-controller';
import { CUSTOM_COUNTRIES } from '../config/countries';

interface FormValues {
  country: string;
  name: string;
  registration_number: string;
}

const validationSchema = Yup.object().shape(
  {
    country: Yup.string().required().label('Country'),
    name: Yup.string()
      .label('Name')
      .when('registration_number', {
        is: (val: string) => val === '',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema,
      }),
    registration_number: Yup.string()
      .label('Registration number')
      .when('name', {
        is: (val: string) => val === '',
        then: (schema) => schema.required(),
        otherwise: (schema) => schema,
      }),
  },
  [['name', 'registration_number']]
);

type CompanySearchProps = {
  company: {
    name: string | null;
    country: string | null;
    registration_number: string | null;
  };
  isLoading: boolean;
  onChange: (values: any) => void;
  next: () => void;
};

const CompanySearch = (props: CompanySearchProps) => {
  const { company, isLoading, onChange, next } = props;

  const { t } = useTranslation();
  const [searchByName, setSearchByName] = useState<boolean>(true);

  const defaultValues: FormValues = {
    country: company.country || '',
    name: company.name || '',
    registration_number: company.registration_number || '',
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
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" alignItems="start">
        <GroupController
          name="country"
          label={t(`steps.company_search.country.label`) || 'Country'}
          isRequired={true}
          control={control}
          render={(field) => (
            <CountrySelect
              onChange={(value: string) => {
                setValue('country', value ?? '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              countries={CUSTOM_COUNTRIES}
              defaultValue={field.value}
            />
          )}
        />

        {searchByName && (
          <Box w="100%">
            <GroupController
              name="name"
              label={t(`steps.company_search.name.label`) || 'Name'}
              isRequired={true}
              control={control}
              render={(field) => <Input type="text" maxW="400px" {...field} />}
            />
            <Button
              variant="ghost"
              onClick={() => {
                setValue('name', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setSearchByName(false);
              }}
              size="sm"
              rightIcon={<ArrowRightIcon size={16} />}
            >
              {t('steps.company_search.search_by_registration_number')}
            </Button>
          </Box>
        )}

        {!searchByName && (
          <Box w="100%">
            <GroupController
              name="registration_number"
              label={
                t(`steps.company_search.registration_number.label`) ||
                'Registration number'
              }
              isRequired={true}
              control={control}
              render={(field) => <Input type="text" maxW="400px" {...field} />}
            />
            <Button
              variant="ghost"
              onClick={() => {
                setValue('registration_number', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setSearchByName(true);
              }}
              size="sm"
              rightIcon={<ArrowRightIcon size={16} />}
            >
              {t('steps.company_search.search_by_name')}
            </Button>
          </Box>
        )}

        <Box>
          <Button
            variant="next"
            rightIcon={<ChevronRightIcon size={16} />}
            isLoading={isLoading}
            isDisabled={!isValid}
            type="submit"
          >
            {t('steps.company_search.button')}
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default CompanySearch;
