import { Box, Flex, Text, useColorModeValue, Avatar } from '@chakra-ui/react'
import { logo } from '../components/Logo'
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
    <Box minH="100vh" bg={useColorModeValue('gray.200', 'gray.900')}>
      <Box
        bg={useColorModeValue('gray.200', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.900')}
        w={{ base: 'full', md: 60 }}
        // pos="fixed"
        h="full"
      >
        <Flex h="20" alignItems="center" mx="20" justifyContent="space-between">
          <Avatar src={`${logo}`} boxSize="80%" />
        </Flex>
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <Flex
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
            >
              <CheckIcon fontSize="large" />
              <Text>{item.title}</Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
