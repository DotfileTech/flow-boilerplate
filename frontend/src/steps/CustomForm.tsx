import * as React from 'react'
import { SimpleGrid, Button, Stack } from '@chakra-ui/react'
import InputForm from '../components/InputForm'
import Joi from 'joi'
import { useTranslation } from 'react-i18next'

function CustomForm(props: any) {
  const { t } = useTranslation()
  const [formValid, setFormValid] = React.useState(false)

  const rules = props.questions
    .filter((ind: { required: any; enabled: any }) => ind.required && ind.enabled)
    .reduce((acc: any, cur: { id: any }) => ({ ...acc, [cur.id]: Joi.string().required() }), {})

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
      <SimpleGrid columns={1} spacing={5}>
        {props.questions
          .filter((question: { enabled: any }) => question.enabled)
          .map((question: any, i: any) => (
            <InputForm
              key={props.question.id}
              value={props.metadata.id}
              onChange={props.changeHandlerMetadata}
              name={question.id}
              isRequired={question.required}
              placeholder={t(question.id)}
            />
          ))}
        <Button variant="next" onClick={props.next} isDisabled={!formValid}>
          {t('next')}
        </Button>
      </SimpleGrid>
    </Stack>
  )
}

export default CustomForm
