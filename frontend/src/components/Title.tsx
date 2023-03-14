import { Box, Heading } from '@chakra-ui/react'

function Title(props: any) {
  return (
    <Box>
      {' '}
      <Heading>{props.children}</Heading>
    </Box>
  )
}

export default Title
