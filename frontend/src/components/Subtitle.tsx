import { Box, Heading } from '@chakra-ui/react'

function Subtitle(props: any) {
  return (
    <Box>
      {' '}
      <Heading
        fontWeight={400}
        fontSize={{ base: '0.5xl', sm: '1xl', md: '2xl' }}
      >
        {props.children}
      </Heading>
    </Box>
  )
}

export default Subtitle
