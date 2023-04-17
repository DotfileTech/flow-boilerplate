import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';

const CustomForm = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = props.questions
    .filter(
      (ind: { required: any; enabled: any }) => ind.required && ind.enabled,
    )
    .reduce(
      (acc: any, cur: { id: any }) => ({
        ...acc,
        [cur.id]: Joi.string().required(),
      }),
      {},
    );

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
        {props.questions
          .filter((question: { enabled: any }) => question.enabled)
          .map((question: any) => (
            <InputForm
              key={props.metadata.id}
              value={props.metadata.id}
              onChange={props.changeHandlerMetadata}
              name={question.id}
              isRequired={question.required}
            />
          ))}
        <Box>
          <Button variant="next" onClick={props.next} isDisabled={!formValid}>
            {t('next')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default CustomForm;
