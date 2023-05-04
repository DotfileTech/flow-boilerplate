import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/form/InputForm';
import Select from '../components/form/Select';
import Radio from '../components/form/Radio';
import CountrySelect from '../components/form/CountrySelect';
import { Country, CustomField } from '../types';

type CustomFormProps = {
  stepId: string;
  fields: CustomField[];
  metadata: { [key: string]: string | null };
  changeHandlerMetadata: (e: any) => void;
  changeHandlerMetadataCustom: (question: string, answer: string) => void;
  countries: Country[];
  isLastStep: boolean;
  next: () => void;
  submit: () => void;
};

const CustomForm = (props: CustomFormProps) => {
  const {
    stepId,
    fields,
    metadata,
    changeHandlerMetadata,
    changeHandlerMetadataCustom,
    countries = [],
    isLastStep = false,
    next,
    submit,
  } = props;

  const { t } = useTranslation();

  const [formValid, setFormValid] = useState<boolean>(false);

  const rules = fields.reduce((acc, cur: CustomField) => {
    let schema;

    switch (cur.type) {
      case 'email':
        schema = Joi.string()
          .empty('')
          .email({ tlds: { allow: false } });
        break;
      case 'tel':
        schema = Joi.string()
          .empty('')
          .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/);
        break;
      case 'url':
        schema = Joi.string().empty('').uri();
        break;
      case 'number':
        schema = Joi.number();
        break;
      case 'date':
        schema = Joi.date();
        break;
      default:
        schema = Joi.string().empty('');
    }

    if (cur.isRequired) {
      schema = schema.required();
    }

    return { ...acc, [cur.id]: schema };
  }, {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const check = schema.validate(props.metadata);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [props.metadata, schema]);

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {fields.map((field: CustomField) => {
          if (field.type === 'select') {
            return (
              <Select
                key={field.id}
                stepId={stepId}
                name={field.id}
                defaultValue={metadata[field.id] || ''}
                isRequired={field.isRequired}
                hasHelper={field.hasHelper}
                options={field.options || []}
                onChange={changeHandlerMetadata}
              />
            );
          }
          if (field.type === 'radio') {
            return (
              <Radio
                key={field.id}
                stepId={stepId}
                name={field.id}
                defaultValue={metadata[field.id] || ''}
                isRequired={field.isRequired}
                hasHelper={field.hasHelper}
                options={field.options || []}
                onChange={changeHandlerMetadataCustom}
              />
            );
          }
          if (field.type === 'country') {
            return (
              <CountrySelect
                key={field.id}
                stepId={stepId}
                name={field.id}
                defaultValue={metadata[field.id] || ''}
                isRequired={field.isRequired}
                hasHelper={field.hasHelper}
                onChange={changeHandlerMetadata}
                countries={countries}
              />
            );
          }
          return (
            <InputForm
              key={field.id}
              stepId={stepId}
              name={field.id}
              defaultValue={metadata[field.id] || ''}
              isRequired={field.isRequired}
              hasHelper={field.hasHelper}
              type={field.type}
              onChange={changeHandlerMetadata}
            />
          );
        })}
        <Box>
          <Button
            variant="next"
            onClick={isLastStep ? submit : next}
            isDisabled={!formValid}
          >
            {t('domain.form.next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default CustomForm;
