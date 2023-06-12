import { Button, Box, VStack, Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { CustomField } from '../types';
import { GroupController } from '../components/form/group-controller';
import CountrySelect from '../components/form/CountrySelect';
import Select from '../components/form/Select';
import { PhoneNumberInput } from '../components/form/phone-number-input';
import Radio from '../components/form/Radio';
import Checkbox from '../components/form/Checkbox';
import { createYupSchema } from '../helpers/create-yup-schema.helper';
import { customFieldsExtendValidation } from '../helpers/custom-fields-extend-validation.helper';

type CustomFormProps = {
  stepId: string;
  fields: CustomField[];
  metadata: { [key: string]: string | null };
  onChange: (values: any) => void;
  next: () => void;
};

const CustomForm = (props: CustomFormProps) => {
  const { stepId, fields, metadata, onChange, next } = props;

  const { t } = useTranslation();

  // Extend fields with our validations
  const dynamicFormData = customFieldsExtendValidation(fields, stepId);
  // Create schema based on added validations
  const customFieldsSchema = dynamicFormData.reduce(createYupSchema, {});
  // Create Yup schema
  const dynamicValidationSchema = Yup.object().shape(customFieldsSchema);

  const defaultValues = fields.reduce(
    (acc, cur: CustomField) => ({ ...acc, [cur.id]: metadata[cur.id] || '' }),
    {}
  );

  const methods = useForm({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(dynamicValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<any> = async (formData) => {
    onChange(formData);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" alignItems="start">
        {fields.map((field: CustomField) => {
          if (field.type === 'select') {
            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.id}
                label={t(`steps.${stepId}.${field.id}.label`) || field.id}
                helper={
                  field.hasHelper
                    ? t(`steps.${stepId}.${field.id}.helper`)
                    : null
                }
                isRequired={field.isRequired}
                control={control}
                render={(f) => (
                  <Select
                    stepId={stepId}
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
                    defaultValue={f.value ?? ''}
                  />
                )}
              />
            );
          }

          if (field.type === 'radio') {
            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.id}
                label={t(`steps.${stepId}.${field.id}.label`) || field.id}
                helper={
                  field.hasHelper
                    ? t(`steps.${stepId}.${field.id}.helper`)
                    : null
                }
                isRequired={field.isRequired}
                control={control}
                render={(f) => (
                  <Radio
                    stepId={stepId}
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

          if (field.type === 'checkbox') {
            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.id}
                label={`${t(`steps.${stepId}.${field.id}.label`) || field.id} ${
                  field.isRequired ? '*' : ''
                }`}
                helper={
                  field.hasHelper
                    ? t(`steps.${stepId}.${field.id}.helper`)
                    : null
                }
                control={control}
                render={(f) => (
                  <Checkbox
                    stepId={stepId}
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
                )}
              />
            );
          }

          if (field.type === 'tel') {
            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.id}
                label={t(`steps.${stepId}.${field.id}.label`) || field.id}
                helper={
                  field.hasHelper
                    ? t(`steps.${stepId}.${field.id}.helper`)
                    : null
                }
                isRequired={field.isRequired}
                control={control}
                render={(f) => (
                  <PhoneNumberInput
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={(f.value ?? '').replace('+', '')}
                    onChange={(value: string) => {
                      setValue(
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        field.id,
                        value ?? '',
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );
                    }}
                  />
                )}
              />
            );
          }

          if (field.type === 'country') {
            return (
              <GroupController
                key={field.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={field.id}
                label={t(`steps.${stepId}.${field.id}.label`) || field.id}
                helper={
                  field.hasHelper
                    ? t(`steps.${stepId}.${field.id}.helper`)
                    : null
                }
                isRequired={field.isRequired}
                control={control}
                render={(f) => (
                  <CountrySelect
                    onChange={(value: string) => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      setValue(field.id, value ?? '', {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
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
              name={field.id}
              label={t(`steps.${stepId}.${field.id}.label`) || field.id}
              helper={
                field.hasHelper ? t(`steps.${stepId}.${field.id}.helper`) : null
              }
              isRequired={field.isRequired}
              control={control}
              render={(f) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return <Input type={field.type} maxW="400px" {...f} />;
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
            {t('domain.form.next')}
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default CustomForm;
