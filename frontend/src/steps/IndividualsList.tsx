import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  Stack,
  Button,
  Tag,
  Box,
  Flex,
  Spacer,
  Heading,
  Show,
} from '@chakra-ui/react';
import { Trash2, EditIcon, PlusSquareIcon } from 'lucide-react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import { individualData } from '../config/Individual';
import { Individual } from '../types';
import { IndividualRoleEnum } from '../constants';

type IndividualsListProps = {
  selectIndividual: (i: number | null) => void;
  individuals: any;
  setIndividuals: any;
  submit: () => void;
  individualsValid: boolean;
  setIndividualsValid: Dispatch<SetStateAction<boolean>>;
};

const IndividualsList = (props: IndividualsListProps) => {
  const {
    selectIndividual,
    individuals,
    setIndividuals,
    submit,
    individualsValid,
    setIndividualsValid,
  } = props;

  const { t } = useTranslation();

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled && ind.type !== 'checkbox')
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    setIndividuals(
      individuals.map((individual: Individual & { isValid: boolean }) => {
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
          individual.isValid = false;
        } else {
          individual.isValid = true;
        }
        return individual;
      })
    );

    setIndividualsValid(
      !individuals.some((e: { isValid: boolean }) => !e.isValid)
    );
  }, []);

  useEffect(() => {
    individuals.map((individual: Individual) => {
      const { address, banking_information, ...data } = individual;
      let values = data;
      if (address) {
        values = { ...address, ...values };
      }
      if (banking_information) {
        values = { ...banking_information, ...values };
      }

      const check = schema.validate(values);
      if (check.error) setIndividualsValid(false);
      return individual;
    });
  }, [individuals]);

  const deleteIndividual = (index: number) => {
    setIndividuals(individuals.filter((_: any, i: number) => i !== index));
  };

  return (
    <Stack spacing={5} pt={2}>
      {individuals.map(
        (individual: Individual & { isValid: boolean }, i: number) => (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            background="white"
            boxShadow="1px 1px 16px rgba(153, 153, 153, 0.1)"
            padding={5}
            key={i}
          >
            <Flex
              direction={{ base: 'column', sm: 'row' }}
              alignItems={{ base: 'start', sm: 'center' }}
            >
              <Heading size="sm">
                {individual.first_name} {individual.last_name}
              </Heading>
              <Spacer />
              {!individual.isValid && (
                <Tag colorScheme="yellow" mr={4} mt={{ base: '12px', md: '0' }}>
                  {t('steps.individuals_list.missing_data')}
                </Tag>
              )}
              <Show above="sm">
                <Box mt={{ base: '12px', md: '0' }}>
                  <Button
                    mr={5}
                    leftIcon={<EditIcon size={16} />}
                    size="sl"
                    onClick={() => selectIndividual(i)}
                    variant="secondary"
                  >
                    {t('steps.individuals_list.edit')}
                  </Button>
                  <Button
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => deleteIndividual(i)}
                    size="sl"
                    variant="secondary"
                  >
                    {t('steps.individuals_list.delete')}
                  </Button>
                </Box>
              </Show>
            </Flex>
            {individual.roles &&
              individual.roles.map((role: IndividualRoleEnum) => (
                <Tag key={role} mt={4} mr={4}>
                  {t(`domain.individual.roles.${role}`)}
                </Tag>
              ))}
            <Show below="sm">
              <Box mt={{ base: '12px', md: '0' }}>
                <Button
                  mr={5}
                  leftIcon={<EditIcon size={16} />}
                  size="sl"
                  onClick={() => selectIndividual(i)}
                  variant="secondary"
                >
                  {t('steps.individuals_list.edit')}
                </Button>
                <Button
                  leftIcon={<Trash2 size={16} />}
                  onClick={() => deleteIndividual(i)}
                  size="sl"
                  variant="secondary"
                >
                  {t('steps.individuals_list.delete')}
                </Button>
              </Box>
            </Show>
          </Box>
        )
      )}
      <Box>
        <Button
          variant="add_individual"
          leftIcon={<PlusSquareIcon size={16} />}
          onClick={() => selectIndividual(null)}
        >
          {t('steps.individuals_list.add_individual')}
        </Button>
      </Box>
      <Box>
        <Button
          variant="next"
          onClick={submit}
          isDisabled={individuals.length === 0 || !individualsValid}
        >
          {t('domain.form.next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IndividualsList;
