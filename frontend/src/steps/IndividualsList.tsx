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
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

import { individualData } from '../config/Individual';

const IndividualsList = (props: any) => {
  const { t } = useTranslation();

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {});

  const schema = Joi.object().keys(rules).unknown(true);

  useEffect(() => {
    props.setIndividuals(
      props.individuals.map((individual: any) => {
        const check = schema.validate(individual);
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
                {t('domain.individual.missing_data')}
              </Tag>
            )}
            <Show above="sm">
              <Box mt={{ base: '12px', md: '0' }}>
                <Button
                  mr={5}
                  leftIcon={<EditIcon />}
                  size="sl"
                  onClick={() => props.selectIndividual(i)}
                  variant="secondary"
                >
                  {t('edit')}
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  onClick={() => deleteIndividual(i)}
                  size="sl"
                  variant="secondary"
                >
                  {t('delete')}
                </Button>
              </Box>
            </Show>
          </Flex>
          {ubo.roles.map((role: any, j: number) => (
            <Tag key={j} mt={4} mr={4}>
              {t(role)}
            </Tag>
          ))}
          <Show below="sm">
            <Box mt={{ base: '12px', md: '0' }}>
              <Button
                mr={5}
                leftIcon={<EditIcon />}
                size="sl"
                onClick={() => props.selectIndividual(i)}
                variant="secondary"
              >
                {t('edit')}
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                onClick={() => deleteIndividual(i)}
                size="sl"
                variant="secondary"
              >
                {t('delete')}
              </Button>
            </Box>
          </Show>
        </Box>
      ))}
      <Box>
        <Button
          variant="add_individual"
          leftIcon={<PlusSquareIcon />}
          onClick={() => props.selectIndividual(null)}
        >
          {t('add_individual')}
        </Button>
      </Box>
      <Box>
        <Button
          variant="next"
          onClick={props.submit}
          isDisabled={props.individuals.length === 0 || !props.individualsValid}
        >
          {t('next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IndividualsList;
