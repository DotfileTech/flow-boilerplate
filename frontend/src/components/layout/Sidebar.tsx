import { Box, Flex, Text, useToken } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import { ReactComponent as Logo } from '../../config/theme/logo.svg';
import { languages } from '../../config/languages';
import SelectLang from '../SelectLang';
import { DotfileLogo } from '../../assets/dotfile-logo';

const Sidebar = () => {
  const [sidebarColor] = useToken('colors', ['sidebar.color']);

  return (
    <Flex
      minH="100%"
      position="fixed"
      background="sidebar.backgroundColor"
      direction="column"
      p="2vw"
      w="25vw"
    >
      <Flex pt={10} pb={10}>
        <Logo />
      </Flex>
      <Box flexGrow={1}>
        <Text
          fontWeight={700}
          color="sidebar.color"
          fontSize={{ base: '3xl', sm: '3xl', md: '3xl' }}
        >
          <Trans i18nKey="brand.title">
            A brand motto with some
            <Text
              as="span"
              fontWeight={700}
              color={'brand.secondary'}
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
          color="sidebar.color"
          mr="10px"
          fontSize="14px"
          lineHeight="2Opx"
          fontWeight="500"
          display="inline-block"
        >
          <b>Powered by</b>
        </Text>
        <DotfileLogo color={sidebarColor} />
      </Flex>
      {languages.length > 1 && <SelectLang />}
    </Flex>
  );
};

export default Sidebar;
