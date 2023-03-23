import {
  Heading,
  Box,
  Tag,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Spacer,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import CheckItem from '../components/CheckItem'

function CheckCard(props: any) {
  const { t } = useTranslation()
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      background="white"
      boxShadow="1px 1px 16px rgba(153, 153, 153, 0.1)"
      padding={2}
    >
      <Accordion allowToggle>
        <AccordionItem borderColor={'white'}>
          <Flex alignItems="center">
            <AccordionButton>
              <Heading size="sm">
                {props.type === 'individual'
                  ? `${props.item.first_name} ${props.item.last_name}`
                  : props.item.name}
              </Heading>
              {props.type === 'individual' &&
                props.item.roles.map((role: any, i: any) => (
                  <Tag key={i} display={['none', 'flex', 'flex']} ml={5}>
                    {t(role)}
                  </Tag>
                ))}

              <Spacer />
              <AccordionIcon />
            </AccordionButton>
          </Flex>
          <AccordionPanel>
            {props.item.checks
              .filter((x: any) => x.type !== 'aml')
              .map((check: any, i: any) => (
                <CheckItem
                  key={i}
                  item={props.item}
                  check={check}
                  selectCheck={props.selectCheck}
                  setCurrentIndividual={props.setCurrentIndividual}
                />
              ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default CheckCard
