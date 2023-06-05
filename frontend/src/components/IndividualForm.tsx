import { Input } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import Checkbox from '../components/form/Checkbox';
import { individualData } from '../config/Individual';
import { Field } from '../types';
import CountrySelect from '../components/form/CountrySelect';
import { GroupController } from './form/group-controller';
import { PhoneNumberInput } from './form/phone-number-input';

type IndividualFormProps = {
  isApplicant: boolean;
};

const IndividualForm = (props: IndividualFormProps) => {
  const { isApplicant } = props;

  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  return (
    <>
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
              isRequired={
                field.required || (field.id === 'email' && isApplicant)
              }
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
    </>
  );
};

export default IndividualForm;
