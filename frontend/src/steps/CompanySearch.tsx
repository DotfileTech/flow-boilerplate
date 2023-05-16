import { Button, VStack, Box, Input } from '@chakra-ui/react';
import * as Yup from 'yup';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import CountrySelect from '../components/form/CountrySelect';
import { GroupController } from '../components/form/group-controller';
import { CUSTOM_COUNTRIES } from '../config/countries';

interface FormValues {
  country: string;
  name: string;
}

const validationSchema = Yup.object({
  country: Yup.string().required(),
  name: Yup.string().required(),
});

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

  const defaultValues: FormValues = {
    country: company.country || '',
    name: company.name || '',
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
    formState: { isValid, isDirty },
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

        <GroupController
          name="name"
          label={t(`steps.company_search.name.label`) || 'Name'}
          isRequired={true}
          control={control}
          render={(field) => <Input type="text" maxW="400px" {...field} />}
        />

        <Box>
          <Button
            variant="next"
            rightIcon={<ChevronRightIcon size={16} />}
            isLoading={isLoading}
            isDisabled={!isValid || !isDirty}
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
