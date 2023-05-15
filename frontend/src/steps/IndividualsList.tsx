import { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

import { Individual } from '../types';
import { IndividualRoleEnum } from '../constants';
import { individualSchema } from './validation/individual.schema';

type IndividualsListProps = {
  selectIndividual: (i: number | null) => void;
  individuals: any;
  setIndividuals: any;
  submit: () => void;
};

const IndividualsList = (props: IndividualsListProps) => {
  const { selectIndividual, individuals, setIndividuals, submit } = props;

  const { t } = useTranslation();

  const [individualsAreValid, setIndividualsAreValid] = useState<boolean>(true);
  const [individualIsValid, setIndividualIsValid] = useState<
    { key: number; isValid: boolean }[]
  >([]);

  useEffect(() => {
    const validIndividuals = async () => {
      for (const [key, individual] of individuals.entries()) {
        const isValid = await individualSchema.isValid(individual);

        if (!isValid) {
          setIndividualsAreValid(false);
        }

        if (
          individualIsValid.length > 0 &&
          individualIsValid.find((t) => t.key === key)
        ) {
          setIndividualIsValid(
            individualIsValid.map((t) =>
              t.key === key ? { ...t, isValid } : { ...t }
            )
          );
        } else {
          setIndividualIsValid((prevFriends) => [
            ...prevFriends,
            {
              key,
              isValid,
            },
          ]);
        }
      }
    };

    validIndividuals();
  }, [individuals]);

  const deleteIndividual = (index: number) => {
    setIndividuals(individuals.filter((_: any, i: number) => i !== index));
  };

  return (
    <Stack spacing={5} pt={2}>
      {individuals.map((individual: Individual, i: number) => {
        return (
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
              {individualIsValid.length > 0 &&
                individualIsValid.find((t) => t.key === i) &&
                !individualIsValid[
                  individualIsValid.findIndex((t) => t.key === i)
                ].isValid && (
                  <Tag
                    colorScheme="yellow"
                    mr={4}
                    mt={{ base: '12px', md: '0' }}
                  >
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
        );
      })}
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
          isDisabled={individuals.length === 0 || !individualsAreValid}
        >
          {t('domain.form.next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IndividualsList;
