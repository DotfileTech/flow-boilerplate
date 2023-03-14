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
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import { DeleteIcon } from '@chakra-ui/icons'

function UploadDocuments(props: any) {
  React.useEffect(() => {
    setFiles([])
  }, [])

  const api = useApi()

  const [file, setFile] = React.useState<File>()
  const [files, setFiles] = React.useState<File[]>([])

  const handleFile = async (event: any) => {
    const combined = [...files, ...event.target.files]
    if (combined) setFiles(combined)
    // setFile(event.target.files[0])
  }

  async function upload() {
    setIsLoading(true)
    const data = new FormData()

    // data.append('file', file as Blob)
    for (let i = 0; i < files.length; i++) {
      data.append('file[]', files[i])
    }

    data.append('checkId', props.currentCheck.id)
    data.append('type', props.currentCheck.type)
    await api.post(`/dotfile/documents`, data)
    await props.fetchMyAPI()
    setFiles([])
    setIsLoading(false)
    props.setIsUpload(false)
  }

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <Modal
      isOpen={props.isUpload}
      onClose={() => {
        setFiles([])
        props.setIsUpload(false)
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
          <input
            accept=".gif, .pdf, .jpeg"
            id="raised-button-file"
            style={{ display: 'none' }}
            ref={inputRef}
            name={props.currentCheck.type}
            required
            onChange={handleFile}
            multiple
            type="file"
          />{' '}
          <Button onClick={handleClick}>Select files</Button>
          {files &&
            files.length > 0 &&
            Array.from(files).map((file: any, i: any) => (
              <Flex key={i} alignItems="center">
                <Button>{file.name}</Button>
                <Spacer />
                <IconButton
                  aria-label="Delete"
                  // onClick={() => deleteIndividual(i)}
                  icon={<DeleteIcon />}
                />
              </Flex>
            ))}
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isLoading} onClick={upload}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UploadDocuments
