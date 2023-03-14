import { Box, Flex, Button, Image } from '@chakra-ui/react'
import { logo } from '../components/Logo'

function Bottomnav(props: any) {
  return (
    <Flex background="gray.500" w={{ base: 'full', md: 60 }}>
      {/* <Box
        flex={1}
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
      > */}
      <Flex h="20" alignItems="center" mx="20" justifyContent="space-between">
        <Image src={`${logo}`} boxSize="80%" />
      </Flex>
      {/* </Box> */}
      <Button>Next</Button>
    </Flex>
  )
}

export default Bottomnav
