import { Box, Heading } from '@chakra-ui/react';

const Title = (props: any) => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        color="brand.main-3"
        fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
      >
        {props.children}
      </Heading>
    </Box>
  );
};

export default Title;
