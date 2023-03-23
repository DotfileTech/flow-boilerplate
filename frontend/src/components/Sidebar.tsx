import { Box, Flex, Text } from '@chakra-ui/react'
import { ReactComponent as DotfileLogo } from '../components/logos/dotfile.svg'
import { ReactComponent as Logo } from '../config/theme/logo.svg'
import { useTranslation } from 'react-i18next'

function Sidebar(props: any) {
  const { t } = useTranslation()

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
          {t('title')}
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
