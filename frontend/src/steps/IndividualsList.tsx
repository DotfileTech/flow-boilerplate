import * as React from 'react'
import {
  Stack,
  Button,
  IconButton,
  Tag,
  Box,
  Flex,
  Spacer,
  Heading,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import Joi from 'joi'
import { individualData } from '../config/Individual'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'

function IndividualsList(props: any) {
  const { t } = useTranslation()

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {})

  const schema = Joi.object().keys(rules).unknown(true)

  React.useEffect(() => {
    props.setIndividuals(
      props.individuals.map((individual: any) => {
        const check = schema.validate(individual)
        if (check.error) individual.isValid = false
        return individual
      }),
    )
  }, [])

  const deleteIndividual = (index: any) => {
    props.setIndividuals(
      props.individuals.filter((_: any, i: any) => i !== index),
    )
  }

  return (
    // TODO Chech validation list

    // TODO: dynamic choice of data from individual to display in listing

    <Stack spacing={5} pt={2}>
      {props.individuals.map((ubo: any, i: any) => (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          background="white"
          boxShadow="1px 1px 16px rgba(153, 153, 153, 0.1)"
          padding={5}
        >
          <Flex alignItems="center">
            <Heading size="sm">
              {ubo.first_name} {ubo.last_name}
            </Heading>
            <Spacer />
            {ubo.isValid === false && <Tag mt={4}>{t('missing_data')}</Tag>}
            <Box>
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
          </Flex>
          {ubo.roles.map((role: any) => (
            <Tag mt={4} mr={4}>
              {t(role)}
            </Tag>
          ))}
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
      <Button
        variant="next"
        onClick={props.submit}
        isDisabled={props.individuals.length === 0}
      >
        {t('next')}
      </Button>
    </Stack>
  )
}

export default IndividualsList
