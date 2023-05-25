import { Dispatch, SetStateAction, useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Divider,
  Heading,
  HStack,
  Show,
  Spacer,
  Tag,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import CheckItem from '../components/CheckItem';
import {
  CheckStatusEnum,
  CheckTypeEnum,
  IndividualRoleEnum,
} from '../constants';
import { hasKyb } from '../config/step';
import type { CheckInterface, Company, Individual } from '../types';
import { CheckCircle2 } from 'lucide-react';
import { Country } from './country';

type Entity =
  | {
      entityType: 'company';
      entity: Company;
    }
  | {
      entityType: 'individual';
      entity: Individual;
    };

type CheckCardProps = {
  selectCheck: (check: CheckInterface) => void;
  setCurrentEntity: Dispatch<SetStateAction<Company | Individual | null>>;
  onOpen: () => void;
} & Entity;

const CheckCard = (props: CheckCardProps) => {
  const { t } = useTranslation();
  const { entity, entityType, selectCheck, setCurrentEntity, onOpen } = props;

  const areAllCheckApproved = useMemo(
    () =>
      entity.checks
        .filter((c: CheckInterface) => c.type !== CheckTypeEnum.aml)
        .every((c) => c.status === CheckStatusEnum.approved),
    [entity]
  );

  const areAllCheckSubmitted = useMemo(
    () =>
      entity.checks
        .filter((c: CheckInterface) => c.type !== CheckTypeEnum.aml)
        .every((c) =>
          [
            CheckStatusEnum.need_review,
            CheckStatusEnum.processing,
            CheckStatusEnum.approved,
          ].includes(c.status)
        ),
    [entity]
  );

  return (
    <Accordion
      defaultIndex={
        areAllCheckApproved || (!areAllCheckApproved && areAllCheckSubmitted)
          ? []
          : [0]
      }
      allowMultiple
    >
      <AccordionItem
        borderColor="gray.200"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="1px 1px 16px rgba(153, 153, 153, 0.1)"
      >
        {({ isExpanded }) => (
          <>
            <AccordionButton
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems="center"
              borderTopRadius="lg"
              borderBottomRadius={isExpanded ? '0' : 'lg'}
              minHeight="20"
              borderColor="gray.200"
              borderWidth="0 0 1px 0"
              py="4"
            >
              <Flex alignItems="center" justifyContent="space-between" w="100%">
                <Box>
                  {areAllCheckApproved && (
                    <Show below="sm">
                      <Box mb="2" textAlign="left">
                        <Tag colorScheme="green">
                          <Box as="span" mr="2">
                            <CheckCircle2 size={16} />
                          </Box>
                          {t('domain.check.status.approved')}
                        </Tag>
                      </Box>
                    </Show>
                  )}
                  <Heading size="sm" textAlign="left">
                    {entityType === 'individual'
                      ? `${entity.first_name} ${entity.last_name}`
                      : entity.name}
                  </Heading>
                  {entityType === 'company' && (
                    <Text mt="2" color="gray.500">
                      <Country code={entity.country} flagOnly mr="2" />
                      {entity.registration_number}
                    </Text>
                  )}
                  {entityType === 'individual' && hasKyb && (
                    <HStack mt="2">
                      {entity.roles.map((role: IndividualRoleEnum) => (
                        <Tag
                          key={role}
                          display="flex"
                          fontSize={{ base: 'xs', md: 'sm' }}
                        >
                          {t(`domain.individual.roles.${role}`)}
                        </Tag>
                      ))}
                    </HStack>
                  )}
                  {!areAllCheckApproved && areAllCheckSubmitted && (
                    <Show above="sm">
                      <Alert status="info" mt="2" px="5" py="2">
                        <AlertIcon />
                        <AlertDescription fontSize="sm">
                          {t('steps.checks_list.all_checks_submitted')}
                        </AlertDescription>
                      </Alert>
                    </Show>
                  )}
                </Box>
                <Spacer />
                {areAllCheckApproved && (
                  <Show above="sm">
                    <Tag mr={5} colorScheme="green">
                      <Box as="span" mr="2">
                        <CheckCircle2 size={16} />
                      </Box>
                      {t('domain.check.status.approved')}
                    </Tag>
                  </Show>
                )}
                <AccordionIcon />
              </Flex>
              {!areAllCheckApproved && areAllCheckSubmitted && (
                <Show below="sm">
                  <Alert status="info" mt="2" px="5" py="2">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      {t('steps.checks_list.all_checks_submitted')}
                    </AlertDescription>
                  </Alert>
                </Show>
              )}
            </AccordionButton>
            <AccordionPanel p={0}>
              <VStack spacing="0" divider={<Divider />}>
                {entity.checks
                  .filter(
                    (check: CheckInterface) => check.type !== CheckTypeEnum.aml
                  )
                  .map((check: CheckInterface) => (
                    <CheckItem
                      key={check.id}
                      entity={entity}
                      check={check}
                      selectCheck={selectCheck}
                      setCurrentEntity={setCurrentEntity}
                      onOpen={onOpen}
                    />
                  ))}
              </VStack>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default CheckCard;
