import * as React from 'react'
import {
  Button,
  Box,
  Flex,
  Spacer,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  ModalFooter,
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import { useTranslation } from 'react-i18next'

function UploadDocuments(props: any) {
  const { t } = useTranslation()

  React.useEffect(() => {
    setFiles([])
  }, [])

  const api = useApi()

  const [fileFront, setFileFront] = React.useState<File>()
  const [fileBack, setFileBack] = React.useState<File>()
  const [files, setFiles] = React.useState<File[]>([])

  const handleFileFront = async (event: any) => {
    setFileFront(event.target.files[0])
  }

  const handleFileBack = async (event: any) => {
    setFileBack(event.target.files[0])
  }

  const handleFiles = async (event: any) => {
    const combined = [...files, ...event.target.files]
    if (combined) setFiles(combined)
    // setFile(event.target.files[0])
  }

  async function upload() {
    setIsLoading(true)
    const data = new FormData()

    // data.append('file', file as Blob)

    data.append('checkId', props.currentCheck.id)
    data.append('type', props.currentCheck.type)

    if (props.currentCheck.type === 'document') {
      for (let i = 0; i < files.length; i++) {
        data.append('file[]', files[i])
      }
      await api.post(`/dotfile/documents`, data)
      await props.fetchMyAPI()
      setIsLoading(false)
      props.setIsUpload(false)
      setFiles([])
    }

    if (props.currentCheck.type === 'id_document') {
      if (fileFront) data.append('file[]', fileFront)
      if (fileBack) data.append('file[]', fileBack)
      await api.post(`/dotfile/identity_documents`, data)
      await new Promise((r) => setTimeout(r, 5000))
      await props.fetchMyAPI()
      setIsLoading(false)
      props.setIsUpload(false)
      setFileFront(undefined)
      setFileBack(undefined)
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputRefFront = React.useRef<HTMLInputElement>(null)
  const inputRefBack = React.useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleClickFront = () => {
    inputRefFront.current?.click()
  }

  const handleClickBack = () => {
    inputRefBack.current?.click()
  }

  const exactType =
    props.currentCheck.type === 'document'
      ? props.currentCheck.subtype.split(':')[1]
      : props.currentCheck.type

  const entityName = props.currentIndividual.name
    ? props.currentIndividual.name
    : `${props.currentIndividual.first_name} ${props.currentIndividual.last_name}`

  return (
    <Modal
      isOpen={props.isUpload}
      size={['full', 'full', 'sm']}
      onClose={() => {
        setFiles([])
        props.setIsUpload(false)
      }}
    >
      <ModalOverlay />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t(`checks.${exactType}.title`)}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody padding={5}>
          <Text mb={5}>
            {t(`checks.${exactType}.title`)} {t(`for`)} {entityName}
          </Text>
          <Text>{t(`checks.${exactType}.description`)}</Text>
          {props.currentCheck.type === 'id_document' && (
            <Box paddingTop={5}>
              <input
                accept=".gif, .pdf, .jpeg, .pdf"
                id="raised-button-file"
                style={{ display: 'none' }}
                ref={inputRefFront}
                name={props.currentCheck.type}
                required
                onChange={handleFileFront}
                type="file"
              />{' '}
              <Button variant="outline" onClick={handleClickFront}>
                {t('upload_document_front')}
              </Button>
              {fileFront && (
                <Flex alignItems="center" padding={5}>
                  <Text>{fileFront.name}</Text>
                  <Spacer />
                </Flex>
              )}
              <input
                accept=".gif, .pdf, .jpeg, .pdf"
                id="raised-button-file"
                style={{ display: 'none' }}
                ref={inputRefBack}
                name={props.currentCheck.type}
                required
                onChange={handleFileBack}
                type="file"
              />{' '}
              <Button variant="outline" onClick={handleClickBack}>
                {t('upload_document_back')}
              </Button>
              {fileBack && (
                <Flex alignItems="center" padding={5}>
                  <Text>{fileBack.name}</Text>
                  <Spacer />
                </Flex>
              )}
            </Box>
          )}

          {props.currentCheck.type === 'document' && (
            <Box paddingTop={5}>
              <input
                accept=".gif, .pdf, .jpeg, .pdf"
                id="raised-button-file"
                style={{ display: 'none' }}
                ref={inputRef}
                name={props.currentCheck.type}
                required
                onChange={handleFiles}
                multiple
                type="file"
              />{' '}
              <Button variant="outline" onClick={handleClick}>
                {t('upload_document')}
              </Button>
              {files &&
                files.length > 0 &&
                Array.from(files).map((file: any, i: any) => (
                  <Flex key={i} alignItems="center" padding={5}>
                    <Text>{file.name}</Text>
                    <Spacer />
                  </Flex>
                ))}
            </Box>
          )}
        </ModalBody>
        <ModalFooter alignItems="center">
          <Button
            variant="next"
            isLoading={isLoading}
            isDisabled={files.length === 0 && fileFront === undefined}
            onClick={upload}
          >
            {t('send_documents')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UploadDocuments
