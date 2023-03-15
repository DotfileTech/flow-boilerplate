import * as React from 'react'
import { Stack, Button, IconButton, Tag, Flex, Spacer } from '@chakra-ui/react'
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons'
import Joi from 'joi'
import { individualData } from '../config/Individual'
import Header from '../components/Header'

function IndividualsList(props: any) {
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
      <Header progress={60}>Verify your individuals list</Header>
      {props.individuals.map((ubo: any, i: any) => (
        <Flex key={i} alignItems="center">
          <Button
            size="lg"
            onClick={() => props.selectIndividual(i)}
            variant="secondary"
          >
            {ubo.first_name} {ubo.last_name}
            <EditIcon ml={5} />
          </Button>
          {ubo.isValid === false && <Tag m={5}>Missing data</Tag>}
          <Spacer />
          <IconButton
            aria-label="Delete"
            onClick={() => deleteIndividual(i)}
            icon={<DeleteIcon />}
          />
        </Flex>
      ))}

      <Button
        variant="fill"
        leftIcon={<PlusSquareIcon/>}
        size="lg"
        onClick={() => props.selectIndividual(null)}
      >
        Add
      </Button>

      <Button
        variant="next"
        onClick={props.submit}
        isDisabled={props.individuals.length === 0}
      >
        Next
      </Button>
    </Stack>
  )
}

export default IndividualsList
