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
    .filter((ind) => ind.enabled && ind.type !== 'checkbox')
    .reduce((acc, cur) => {
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

      switch (cur.id) {
        case 'iban':
          schema = schema.min(15);
          break;
        case 'bic':
          schema = schema.min(8);
          break;
      }

      if (cur.required) {
        schema = schema.required();
      } else {
        schema = schema.allow(null);
      }

      return { ...acc, [cur.id]: schema };
    }, {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const { address, banking_information, ...data } = props.individual;
    let values = data;
    if (address) {
      values = { ...address, ...values };
    }
    if (banking_information) {
      values = { ...banking_information, ...values };
    }

    const check = schema.validate(values);
    if (check.error) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [props.individual, schema]);

  const changeHandlerIndividual = (e: any, nested: string) => {
    if (nested) {
      props.setIndividual({
        ...props.individual,
        [nested]: {
          ...props.individual[nested],
          [e.target.name]: e.target.value,
        },
      });
    } else {
      props.setIndividual({
        ...props.individual,
        [e.target.name]: e.target.value,
      });
    }
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
      const index = props.individual.roles.indexOf(event.target.value);
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
                  onChange={(e: any) => changeHandlerIndividual(e, ind.nested)}
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
                onChange={(e: any) => changeHandlerIndividual(e, ind.nested)}
                name={ind.id}
                isRequired={ind.required}
                hasHelper={ind.hasHelper}
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
