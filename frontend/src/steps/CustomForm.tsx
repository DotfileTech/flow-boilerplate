import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import Select from '../components/Select';
import Radio from '../components/Radio';

type CustomFormProps = {
  stepId: string;
  fields: Field[];
  metadata: any;
  changeHandlerMetadata: any;
  changeHandlerMetadataCustom: any;
  next: any;
};

type Field = {
  id: string;
  type: 'select' | 'radio' | 'text' | 'date' | 'number' | 'url';
  isRequired: boolean;
  hasHelper?: boolean;
  options?: string[];
};

const CustomForm = (props: CustomFormProps) => {
  const {
    stepId,
    fields,
    metadata,
    changeHandlerMetadata,
    changeHandlerMetadataCustom,
    next,
  } = props;
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = fields
    .filter((field) => field.isRequired)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

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
        {fields.map((field: Field) => {
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
          <Button variant="next" onClick={next} isDisabled={!formValid}>
            {t('domain.form.next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default CustomForm;
