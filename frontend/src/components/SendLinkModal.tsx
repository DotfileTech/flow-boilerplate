import * as React from 'react'
import {
  Stack,
  Button,
  Heading,
  Flex,
  IconButton,
  Spacer,
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  ModalFooter,
  Input,
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import { DeleteIcon } from '@chakra-ui/icons'

function UploadDocuments(props: any) {
  const api = useApi()

  const [email, setEmail] = React.useState('')

  const sendEmail = async (e: any) => {
    await api.post(`dotfile/send`, {
      checkId: e.target.id,
      caseId: props.caseId,
      email,
    })
    setEmail('')
    props.setIsSendEmail(false)
    // return window.location.replace(response.data.url)
  }

  const changeHandler = (event: any) => {
    setEmail(event.target.value)
  }

  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <Modal
      isOpen={props.isSendEmail}
      onClose={() => {
        setEmail('')
        props.setIsSendEmail(false)
      }}
    >
      <ModalOverlay />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.currentIndividual.name
            ? props.currentIndividual.name
            : `${props.currentIndividual.first_name} ${props.currentIndividual.last_name}`}
          {' - '}
          {props.currentCheck.type === 'document'
            ? props.currentCheck.subtype.split(':')[1]
            : props.currentCheck.type}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            pr="4.5rem"
            type="email"
            isRequired
            placeholder="Email"
            value={email}
            onChange={changeHandler}
            name="email"
          />
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isLoading} onClick={sendEmail}>
            Send link
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UploadDocuments
