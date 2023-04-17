import { useState, useEffect } from 'react';
import {
  SimpleGrid,
  Button,
  Checkbox,
  Stack,
  FormControl,
  FormLabel,
  Box,
} from '@chakra-ui/react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import InputForm from '../components/InputForm';
import SelectFloatingLabel from '../components/SelectFloatingLabel';
import { individualData } from '../config/Individual';
import { IndividualRoleEnum } from '../constants'

const IndividualEdit = (props: any) => {
  const { t } = useTranslation();
  const [formValid, setFormValid] = useState(false);

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    const check = schema.validate(props.individual);
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
    })
  };

  const checkBoxChangeHandler = (event: any) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles
          ? [...props.individual.roles, event.target.value]
          : [event.target.value],
      })
    } else {
      let index = props.individual.roles.indexOf(event.target.value)
      props.individual.roles.splice(index, 1)
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles,
      })
    }
  };

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={6}>
        {individualData
          .filter((ind) => ind.enabled)
          .filter((ind) => ind.category === 'personal')
          .map((ind: any, i: number) => (
            <InputForm
              key={i}
              value={props.individual[ind.id] || ''}
              onChange={changeHandlerIndividual}
              name={ind.id}
              isRequired={ind.required}
              type={ind.type}
            />
          ))}

        <SelectFloatingLabel
          value={props.individual?.birth_country || ''}
          onChange={changeHandlerIndividual}
          name="birth_country"
          countries={props.countries}
        />

        {individualData
          .filter((ind) => ind.enabled)
          .filter((ind) => ind.category === 'address')
          .map((ind: any, i: number, array) => {
            return(
              <>
                <InputForm
                  key={i}
                  value={props.individual[ind.id] || ''}
                  onChange={changeHandlerIndividual}
                  name={ind.id}
                  isRequired={ind.required}
                  type={ind.type}
                />
                {i + 1 === array.length && (
                  <SelectFloatingLabel
                    value={props.individual?.address?.country || ''}
                    onChange={changeHandlerIndividual}
                    name="country"
                    countries={props.countries}
                  />
                )}
              </>
            );
          })}

        <FormControl>
          <FormLabel>{t('roles')}</FormLabel>
          <Stack spacing={5} direction="row">
            <Checkbox
              isChecked={
                props.individual.roles
                  ? props.individual.roles.includes(IndividualRoleEnum.beneficial_owner)
                  : false
              }
              value={IndividualRoleEnum.beneficial_owner}
              onChange={checkBoxChangeHandler}
            >
              {t('beneficial_owner')}
            </Checkbox>
            <Checkbox
              isChecked={
                props.individual.roles
                  ? props.individual.roles.includes(IndividualRoleEnum.legal_representative)
                  : false
              }
              value={IndividualRoleEnum.legal_representative}
              onChange={checkBoxChangeHandler}
            >
              {t('legal_representative')}
            </Checkbox>
          </Stack>
        </FormControl>

        {individualData
          .filter((ind) => ind.enabled)
          .filter((ind) => ind.category === 'roles')
          .map((ind: any, i: number) => (
            <InputForm
              key={i}
              value={props.individual[ind.id] || ''}
              onChange={changeHandlerIndividual}
              name={ind.id}
              isRequired={ind.required}
              type={ind.type}
            />
          ))}

        <Box>
          <Button
            variant="next"
            onClick={() => props.saveIndividual(null)}
            isDisabled={!formValid}
          >
            {t('save')}
          </Button>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};

export default IndividualEdit;
