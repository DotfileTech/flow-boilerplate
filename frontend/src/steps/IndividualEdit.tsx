import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import CountrySelect from '../components/CountrySelect';
import Checkbox from '../components/Checkbox';
import { individualData } from '../config/Individual';

const IndividualEdit = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled && ind.type !== 'checkbox')
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const { address, ...data } = props.individual;
    let values = data;
    if (address) {
      values = { ...address, ...values };
    }

    const check = schema.validate(values);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [props.individual, schema]);

  const changeHandlerIndividual = (e: any) => {
    props.setIndividual({
      ...props.individual,
      [e.target.name]: e.target.value,
    });
  };

  const checkBoxChangeHandler = (event: any) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles
          ? [...props.individual.roles, event.target.value]
          : [event.target.value],
      });
    } else {
      let index = props.individual.roles.indexOf(event.target.value);
      props.individual.roles.splice(index, 1);
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles,
      });
    }
  };

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={6}>
        {individualData
          .filter((ind) => ind.enabled)
          .map((ind: any) => {
            const defaultValue = ind.nested
              ? props.individual[ind.nested]
                ? props.individual[ind.nested][ind.id]
                : ''
              : props.individual[ind.id];

            if (ind.type === 'checkbox') {
              return (
                <Checkbox
                  key={`individual_${ind.id}`}
                  stepId="individual_edit"
                  name={ind.id}
                  defaultValue={defaultValue || ''}
                  isRequired={ind.required}
                  options={ind.options || []}
                  onChange={checkBoxChangeHandler}
                />
              );
            }

            if (ind.type === 'country') {
              return (
                <CountrySelect
                  key={`individual_${ind.id}`}
                  stepId="individual_edit"
                  defaultValue={defaultValue || ''}
                  onChange={changeHandlerIndividual}
                  name={ind.id}
                  countries={props.countries}
                  isRequired={ind.required}
                />
              );
            }

            return (
              <InputForm
                key={`individual_${ind.id}`}
                stepId="individual_edit"
                defaultValue={defaultValue || ''}
                onChange={changeHandlerIndividual}
                name={ind.id}
                isRequired={ind.required}
                type={ind.type}
              />
            );
          })}

        <Box>
          <Button
            variant="next"
            onClick={() => props.saveIndividual(null)}
            isDisabled={!formValid}
          >
            {t('domain.form.save')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default IndividualEdit;
