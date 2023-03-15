import { Box, Flex, Text, Heading, Image } from '@chakra-ui/react'
import { logo } from '../components/Logo'
import { bg } from '../components/Background'
import { CheckIcon } from '@chakra-ui/icons'

const items = [
  {
    icon: <CheckIcon fontSize="small" />,
    title: 'Company',
  },
  {
    icon: <CheckIcon fontSize="small" />,
    title: 'Individuals',
  },
  {
    icon: <CheckIcon fontSize="small" />,
    title: 'Checks',
  },
]

function Sidebar(props: any) {
  return (
    <Box minH="100vh" bg={'black'} backgroundImage={`${bg}`}>
      <Box
        m={10}
        w={{ base: 'full', md: 300 }}

        // pos="fixed"
        // h="full"
      >
        <Image pt={10} pb={10} src={`${logo}`} />
        <Heading
          fontWeight={600}
          color={'white'}
          fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
        >
          Acme partners with Dotfile for a secure compliance process
        </Heading>
      </Box>
    </Box>
  )
}

export default Sidebar
