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

const CheckCard = (props: any) => {
  const { t } = useTranslation();

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
                {props.type === 'individual'
                  ? `${props.item.first_name} ${props.item.last_name}`
                  : props.item.name}
              </Heading>
              {props.type === 'individual' &&
                hasKyb &&
                props.item.roles.map((role: IndividualRoleEnum, i: number) => (
                  <Tag key={i} display={['none', 'flex', 'flex']} ml={5}>
                    {t(`domain.individual.roles.${role}`)}
                  </Tag>
                ))}
              <Spacer />
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={0}>
              <VStack spacing="0" divider={<Divider />}>
                {props.item.checks
                  .filter((check: any) => check.type !== CheckTypeEnum.aml)
                  .map((check: any, i: number) => (
                    <CheckItem
                      key={i}
                      item={props.item}
                      check={check}
                      selectCheck={props.selectCheck}
                      setCurrentIndividual={props.setCurrentIndividual}
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
