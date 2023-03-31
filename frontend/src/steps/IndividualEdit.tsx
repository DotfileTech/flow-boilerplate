import * as React from 'react'
import {
  SimpleGrid,
  Button,
  Checkbox,
  Stack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import InputForm from '../components/InputForm'
import Joi from 'joi'
import { individualData } from '../config/Individual'
import SelectFloatingLabel from '../components/SelectFloatingLabel'

function IndividualEdit(props: any) {
  const [formValid, setFormValid] = React.useState(false)

  const rules = individualData
    .filter((ind) => ind.required && ind.enabled)
    .reduce((acc, cur) => ({ ...acc, [cur.id]: Joi.string().required() }), {})

  const schema = Joi.object().keys(rules).unknown(true)

  React.useEffect(() => {
    const check = schema.validate(props.individual)
    if (check.error) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [props.individual, schema])

  const changeHandlerIndividual = (e: any) => {
    props.setIndividual({
      ...props.individual,
      [e.target.name]: e.target.value,
    })
  }

  const checkBoxChangeHandler = (event: any) => {
    const isChecked = event.target.checked

    if (isChecked) {
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles
          ? [...props.individual.roles, event.target.value]
          : [event.target.value],
      })
    } else {
      let index = props.individual.roles.indexOf(event.target.value)
      props.individual.roles.splice(index, 1)
      props.setIndividual({
        ...props.individual,
        roles: props.individual.roles,
      })
    }
  }

  return (
    <Stack spacing={5} pt={2}>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl>
          <FormLabel>Roles</FormLabel>
          <Stack spacing={5} direction="row">
            <Checkbox
              isChecked={
                props.individual.roles
                  ? props.individual.roles.includes('beneficial_owner')
                  : false
              }
              value="beneficial_owner"
              onChange={checkBoxChangeHandler}
            >
              Beneficial owner
            </Checkbox>
            <Checkbox
              isChecked={
                props.individual.roles
                  ? props.individual.roles.includes('legal_representative')
                  : false
              }
              value="legal_representative"
              onChange={checkBoxChangeHandler}
            >
              Legal Representative
            </Checkbox>
          </Stack>
        </FormControl>

        <SelectFloatingLabel
          value={props.individual ? props.individual.birth_country : ''}
          onChange={changeHandlerIndividual}
          name="birth_country"
          placeholder="Birth country"
          countries={props.countries}
        />

        {individualData
          .filter((ind) => ind.enabled)
          .map((ind: any, i: any) => (
            <InputForm
              key={i}
              value={props.individual[ind.id]}
              onChange={changeHandlerIndividual}
              name={ind.id}
              placeholder={ind.label}
              isRequired={ind.required}
              type={ind.type}
            />
          ))}

        <SimpleGrid columns={2} spacing={3}>
          <Button variant="outline" onClick={props.back}>
            Cancel
          </Button>
          <Button
            variant="next"
            onClick={() => props.saveIndividual(null)}
            isDisabled={!formValid}
          >
            Save
          </Button>
        </SimpleGrid>
      </SimpleGrid>
    </Stack>
  )
}

export default IndividualEdit
