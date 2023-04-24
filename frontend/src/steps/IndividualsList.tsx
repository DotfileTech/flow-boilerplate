import { useEffect } from 'react';
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

const IndividualsList = (props: any) => {
  const { t } = useTranslation();

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled && ind.type !== 'checkbox')
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    props.setIndividuals(
      props.individuals.map((individual: any) => {
        const { address, ...data } = individual;
        let values = data;
        if (address) {
          values = { ...address, ...values };
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

    props.setIndividualsValid(
      !props.individuals.some((e: { isValid: boolean }) => !e.isValid)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.individuals.map((individual: any) => {
      const check = schema.validate(individual);
      if (check.error) props.setIndividualsValid(false);
      return individual;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.individuals]);

  const deleteIndividual = (index: any) => {
    props.setIndividuals(
      props.individuals.filter((_: any, i: any) => i !== index)
    );
  };

  return (
    <Stack spacing={5} pt={2}>
      {props.individuals.map((ubo: any, i: number) => (
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
              {ubo.first_name} {ubo.last_name}
            </Heading>
            <Spacer />
            {ubo.isValid === false && (
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
                  onClick={() => props.selectIndividual(i)}
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
          {ubo.roles &&
            ubo.roles.map((role: any, j: number) => (
              <Tag key={j} mt={4} mr={4}>
                {t(`domain.individual.roles.${role}`)}
              </Tag>
            ))}
          <Show below="sm">
            <Box mt={{ base: '12px', md: '0' }}>
              <Button
                mr={5}
                leftIcon={<EditIcon size={16} />}
                size="sl"
                onClick={() => props.selectIndividual(i)}
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
      ))}
      <Box>
        <Button
          variant="add_individual"
          leftIcon={<PlusSquareIcon size={16} />}
          onClick={() => props.selectIndividual(null)}
        >
          {t('steps.individuals_list.add_individual')}
        </Button>
      </Box>
      <Box>
        <Button
          variant="next"
          onClick={props.submit}
          isDisabled={props.individuals.length === 0 || !props.individualsValid}
        >
          {t('domain.form.next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IndividualsList;
