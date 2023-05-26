import { Flex, Box } from '@chakra-ui/react';

import { ReactComponent as Logo } from '../../config/theme/logo.svg';

const MobileHeader = () => {
  return (
    <Flex
      ml="0"
      px="4"
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      position="static"
      justifyContent="center"
      background="brand.sidebarBg"
    >
      <Box pt={2} pb={2}>
        <Logo width="80%" />
      </Box>
    </Flex>
  );
};

export default MobileHeader;
