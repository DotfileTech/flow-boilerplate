import { Flex, Box } from '@chakra-ui/react'
import { ReactComponent as Logo } from '../components/logos/sample.svg'

function Sidebar(props: any) {
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      position="static"
      justifyContent="flex-start"
      background="brand.sidebar"
    >
      <Box pt={2} pb={2}>
        <Logo />
      </Box>
    </Flex>
  )
}

export default Sidebar
