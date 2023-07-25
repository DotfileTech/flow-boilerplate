import { useEffect } from 'react';
import { Heading, Input, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import Checkbox from '../components/form/Checkbox';
import { individualData } from '../config/Individual';
import { Field } from '../types';
import CountrySelect from '../components/form/CountrySelect';
import { GroupController } from './form/group-controller';
import { PhoneNumberInput } from './form/phone-number-input';
import { IndividualRoleEnum } from '../constants';

type IndividualFormProps = {
  isApplicant: boolean;
};

const IndividualForm = (props: IndividualFormProps) => {
  const { isApplicant } = props;

  const { t } = useTranslation();
  const { control, setValue, getValues, setError } = useFormContext();

  useEffect(() => {
    if (isApplicant && !getValues('email')) {
      setError('email', {
        type: 'manual',
        message: "Please add applicant's email to continue",
      });
    }
  }, [setError, isApplicant, getValues]);

  return (
    <>
      {individualData.map((field: Field) => {
        if (!field.enabled) {
          return (
            <GroupController
              key={field.id}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.nested ? `${field.nested}.${field.id}` : field.id}
              isRequired={false}
              control={control}
              render={(f) => {
                return (
                  <Input
                    type="hidden"
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
        }

        if (field.type === 'checkbox') {
          return (
            <GroupController
              key={
                field.nested
                  ? `individual_${field.nested}_${field.id}`
                  : `individual_${field.id}`
              }
              mb="6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.nested ? `${field.nested}.${field.id}` : field.id}
              label={`${
                t(`steps.individual_edit.${field.id}.label`) || field.id
              } ${field.required ? '*' : ''}`}
              helper={
                field.hasHelper
                  ? t(`steps.individual_edit.${field.id}.helper`)
                  : null
              }
              control={control}
              render={(f) => {
                return (
                  <Checkbox
                    stepId="individual_edit"
                    name={field.id}
                    onChange={(values: string[]) => {
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
              mb="6"
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

        if (field.type === 'tel') {
          return (
            <GroupController
              key={field.id}
              mb="6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.id}
              label={t(`steps.individual_edit.${field.id}.label`) || field.id}
              helper={
                field.hasHelper
                  ? t(`steps.individual_edit.${field.id}.helper`)
                  : null
              }
              isRequired={field.required}
              control={control}
              render={({ onChange, value }) => (
                <PhoneNumberInput
                  value={(value ?? '').replace('+', '')}
                  onChange={(phoneNumber: string) => {
                    onChange(phoneNumber.replace('+', '') ? phoneNumber : null);
                  }}
                />
              )}
            />
          );
        }

        return (
          <Box w="100%" key={field.id} mb="6">
            {field.nested &&
              t(`steps.individual_edit.nested.${field.nested}`) !== '' &&
              (field.id === 'street_address' || field.id === 'iban') && (
                <Heading
                  pt="5"
                  pb="2"
                  fontWeight={600}
                  color="brand.main-3"
                  fontSize={{ base: 'xl', md: '2xl' }}
                >
                  {t(`steps.individual_edit.nested.${field.nested}`)}
                </Heading>
              )}
            <GroupController
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              name={field.nested ? `${field.nested}.${field.id}` : field.id}
              label={t(`steps.individual_edit.${field.id}.label`) || field.id}
              helper={
                field.hasHelper
                  ? t(`steps.individual_edit.${field.id}.helper`)
                  : null
              }
              isRequired={
                field.required ||
                (field.id === 'email' &&
                  (isApplicant ||
                    getValues('roles').includes(IndividualRoleEnum.applicant)))
              }
              control={control}
              render={(f) => {
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
          </Box>
        );
      })}
    </>
  );
};

export default IndividualForm;
