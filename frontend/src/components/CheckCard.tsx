import { Dispatch, SetStateAction } from 'react';
import {
  Heading,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Spacer,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import CheckItem from '../components/CheckItem';
import { CheckTypeEnum, IndividualRoleEnum } from '../constants';
import { hasKyb } from '../config/step';
import type { Individual, Company, CheckInterface } from '../types';

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

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
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
              alignItems="center"
              borderTopRadius="lg"
              borderBottomRadius={isExpanded ? '0' : 'lg'}
              minHeight="20"
              borderColor="gray.200"
              borderWidth="0 0 1px 0"
            >
              <Heading size="sm">
                {entityType === 'individual'
                  ? `${entity.first_name} ${entity.last_name}`
                  : entity.name}
              </Heading>
              {entityType === 'individual' &&
                hasKyb &&
                entity.roles.map((role: IndividualRoleEnum) => (
                  <Tag key={role} display={['none', 'flex', 'flex']} ml={5}>
                    {t(`domain.individual.roles.${role}`)}
                  </Tag>
                ))}
              <Spacer />
              <AccordionIcon />
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
