import { useState, useEffect } from 'react';
import { SimpleGrid, Button, Stack, Box } from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/form/InputForm';
import CountrySelect from '../components/form/CountrySelect';
import Checkbox from '../components/form/Checkbox';
import { individualData } from '../config/Individual';
import { Country, Field } from '../types';

type IndividualEditProps = {
  individual: any;
  setIndividual: any;
  saveIndividual: any;
  countries: Country[];
};

const IndividualEdit = (props: IndividualEditProps) => {
  const { individual, setIndividual, saveIndividual, countries } = props;

  const { t } = useTranslation();

  const [formValid, setFormValid] = useState<boolean>(false);

  const rules = individualData
    .filter((field: Field) => field.enabled && field.type !== 'checkbox')
    .reduce((acc, cur: Field) => {
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
    const { address, banking_information, ...data } = individual;
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
  }, [individual, schema]);

  const changeHandlerIndividual = (e: any, nested: string | undefined) => {
    if (nested) {
      setIndividual({
        ...individual,
        [nested]: {
          ...individual[nested],
          [e.target.name]: e.target.value,
        },
      });
    } else {
      setIndividual({
        ...individual,
        [e.target.name]: e.target.value,
      });
    }
  };

  const checkBoxChangeHandler = (event: any) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setIndividual({
        ...individual,
        roles: individual.roles
          ? [...individual.roles, event.target.value]
          : [event.target.value],
      });
    } else {
      const index = individual.roles.indexOf(event.target.value);
      individual.roles.splice(index, 1);
      setIndividual({
        ...individual,
        roles: individual.roles,
      });
    }
  };

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={6}>
        {individualData
          .filter((field) => field.enabled)
          .map((field: Field) => {
            const defaultValue = field.nested
              ? individual[field.nested]
                ? individual[field.nested][field.id]
                : ''
              : individual[field.id];

            if (field.type === 'checkbox') {
              return (
                <Checkbox
                  key={`individual_${field.id}`}
                  stepId="individual_edit"
                  name={field.id}
                  defaultValue={defaultValue || ''}
                  isRequired={field.required}
                  options={field.options || []}
                  onChange={checkBoxChangeHandler}
                />
              );
            }

            if (field.type === 'country') {
              return (
                <CountrySelect
                  key={`individual_${field.id}`}
                  stepId="individual_edit"
                  defaultValue={defaultValue || ''}
                  onChange={(e: any) =>
                    changeHandlerIndividual(e, field.nested)
                  }
                  name={field.id}
                  countries={countries}
                  isRequired={field.required}
                />
              );
            }

            return (
              <InputForm
                key={`individual_${field.id}`}
                stepId="individual_edit"
                defaultValue={defaultValue || ''}
                onChange={(e: any) => changeHandlerIndividual(e, field.nested)}
                name={field.id}
                isRequired={field.required}
                hasHelper={field.hasHelper}
                type={field.type}
              />
            );
          })}

        <Box>
          <Button
            variant="next"
            onClick={() => saveIndividual(null)}
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
