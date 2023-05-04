import { Flex, Box } from '@chakra-ui/react';

import { ReactComponent as Logo } from '../../config/theme/logo.svg';

const Sidebar = () => {
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
      background="brand.sidebarBg"
    >
      <Box pt={2} pb={2}>
        <Logo width="80%" />
      </Box>
    </Flex>
  );
};

export default Sidebar;
