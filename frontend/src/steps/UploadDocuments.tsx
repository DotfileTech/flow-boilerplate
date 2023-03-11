import * as React from 'react'
import {
  Stack,
  Button,
  Heading,
  Flex,
  IconButton,
  Spacer,
} from '@chakra-ui/react'
import useApi from '../hooks/useApi'
import { DeleteIcon } from '@chakra-ui/icons'

function UploadDocuments(props: any) {
  const api = useApi()

  const processCheck = async (e: any) => {
    const response = await api.post(`dotfile/checks`, {
      checkId: e.target.id,
      type: e.target.name,
    })
    return window.location.replace(response.data.url)
  }

  const [data, setData] = React.useState({
    individuals: [],
  })

  // const [files, setFiles] = React.useState([])
  const [file, setFile] = React.useState<File>()

  const handleFile = async (event: any) => {
    setFile(event.target.files[0])
    // const output = await upload(
    //   event.target.files[0],
    //   event.target.id,
    //   event.target.name,
    // )
  }

  async function upload() {
    const data = new FormData()
    data.append('file', file as Blob)
    data.append('checkId', props.currentCheck.id)
    data.append('type', props.currentCheck.type)
    await api.post(`/dotfile/documents`, data)
    await props.fetchMyAPI()
    props.setIsUpload(false)
  }

  return (
    <Stack spacing={5} pt={2}>
      <Heading>{`${props.currentIndividual.first_name} ${props.currentIndividual.last_name}`}</Heading>
      <Heading>
        {props.currentCheck.type === 'document'
          ? props.currentCheck.subtype.split(':')[1]
          : props.currentCheck.type}
      </Heading>
      <input
        accept=".gif, .pdf, .jpeg"
        // style={{ display: 'none' }}
        // id="raised-button-file"
        id={props.currentCheck.id}
        name={props.currentCheck.type}
        required
        onChange={handleFile}
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined">Upload (.doc or .docx)</Button>
      </label>
      {file && (
        <Flex alignItems="center">
          <Button >{file.name}</Button>
          <Spacer />
          <IconButton
            aria-label="Delete"
            // onClick={() => deleteIndividual(i)}
            icon={<DeleteIcon />}
          />
        </Flex>
      )}
      {/* {files.length > 0 &&
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
        ))} */}
      <Button onClick={upload}>Upload</Button>
      <Button onClick={() => props.setIsUpload(false)}>Back</Button>
    </Stack>
  )
}

export default UploadDocuments
