import { Box, Flex, Text } from '@chakra-ui/react'
import { ReactComponent as DotfileLogo } from '../components/logos/dotfile.svg'
import { ReactComponent as Logo } from '../config/theme/logo.svg'
import { Trans } from 'react-i18next'

function Sidebar(props: any) {
  return (
    <Flex
      minH="100%"
      position="fixed"
      background="brand.sidebar"
      display={{ base: 'none', md: 'flex' }}
      direction="column"
      p="2vw"
      w={{ base: 'full', md: '25vw' }}
    >
      <Box pt={10} pb={10}>
        <Logo width="80%" />
      </Box>
      <Box flexGrow={1}>
        <Text
          fontWeight={700}
          color={'white'}
          fontSize={{ base: '3xl', sm: '3xl', md: '3xl' }}
        >
          <Trans i18nKey="brand.title">
            A brand motto with some
            <Text
              as="span"
              fontWeight={700}
              color={'brand.accent'}
              fontSize={{ base: '3xl', sm: '3xl', md: '3xl' }}
            >
              accent words
            </Text>
            if needed.
          </Trans>
        </Text>
      </Box>
      <Flex alignItems="center" mb="5vh">
        <Text
          color="white"
          mr="10px"
          fontSize="14px"
          lineHeight="2Opx"
          fontWeight="500"
          display="inline-block"
        >
          <b>Powered by</b>
        </Text>
        <DotfileLogo />
      </Flex>
    </Flex>
  )
}

export default Sidebar
