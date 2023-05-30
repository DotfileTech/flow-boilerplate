import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Show,
  Spacer,
  Stack,
  Tag,
} from '@chakra-ui/react';
import { EditIcon, PlusSquareIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Individual } from '../types';
import { IndividualRoleEnum } from '../constants';
import { individualSchema } from './validation/individual.schema';
import { hasApplicant } from '../config/step';
import { SetApplicant } from '../components/set-applicant';

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
      let createIndividualIsValid: { key: number; isValid: boolean }[] = [];
      setIndividualsAreValid(true);

      for (const [key, individual] of individuals.entries()) {
        const isValid = await individualSchema.isValid(individual);

        if (!isValid) {
          setIndividualsAreValid(false);
        }

        createIndividualIsValid = [
          ...createIndividualIsValid,
          {
            key,
            isValid,
          },
        ];
      }

      setIndividualIsValid(createIndividualIsValid);
    };

    validIndividuals();
  }, [individuals]);

  const deleteIndividual = (index: number) => {
    setIndividuals(individuals.filter((_: any, i: number) => i !== index));
  };

  const selectApplicant = (individualNumber: string) => {
    const updatedIndividuals = individuals.map(
      (individual: Individual, index: number) => {
        if (individualNumber === index.toString()) {
          return {
            ...individual,
            roles: [...individual.roles, IndividualRoleEnum.applicant],
          };
        }
        return {
          ...individual,
          roles: individual.roles.filter(
            (role: IndividualRoleEnum) => role !== IndividualRoleEnum.applicant
          ),
        };
      }
    );
    setIndividuals(updatedIndividuals);
  };

  const noSelectedApplicant = useMemo(
    () =>
      hasApplicant &&
      individuals.findIndex((individual: Individual) =>
        individual.roles.includes(IndividualRoleEnum.applicant)
      ) === -1,
    [individuals]
  );

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
              individual.roles
                .filter(
                  (role: IndividualRoleEnum) =>
                    role !== IndividualRoleEnum.applicant
                )
                .map((role: IndividualRoleEnum) => (
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
      {hasApplicant && individuals.length > 0 && (
        <SetApplicant
          individuals={individuals}
          selectApplicant={selectApplicant}
        />
      )}
      <Box>
        <Button
          variant="next"
          onClick={submit}
          isDisabled={
            individuals.length === 0 ||
            !individualsAreValid ||
            noSelectedApplicant
          }
        >
          {t('domain.form.next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default IndividualsList;
