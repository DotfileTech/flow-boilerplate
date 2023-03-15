import * as React from 'react'
import { SimpleGrid, Button, Stack } from '@chakra-ui/react'
import InputFloatingLabel from '../components/InputFloatingLabel'
import Joi from 'joi'
import { questions } from '../config/Form'
import Header from '../components/Header'

function CustomForm(props: any) {
  const [formValid, setFormValid] = React.useState(false)

  const rules = questions
    .filter((ind) => ind.required && ind.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {})

  const schema = Joi.object().keys(rules).unknown(true)

  React.useEffect(() => {
    const check = schema.validate(props.metadata)
    if (check.error) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [props.metadata, schema])

  return (
    <Stack spacing={5} pt={2}>
      <Header progress={40}>Tell us more about your company</Header>
      <SimpleGrid columns={1} spacing={5}>
        {questions
          .filter((question) => question.enabled)
          .map((question: any, i: any) => (
            <InputFloatingLabel
              key={props.metadata.id}
              value={props.metadata.id}
              onChange={props.changeHandlerMetadata}
              name={question.id}
              isRequired={question.required}
              placeholder={question.label}
            />
          ))}
        <Button variant="next" onClick={props.next} isDisabled={!formValid}>
          Next
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default CustomForm
