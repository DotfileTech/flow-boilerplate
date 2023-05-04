import { Heading, Text, Image, Center, Flex, Box } from '@chakra-ui/react';
import AlertIcon from '../assets/alert-icon.png';

export const NotFound = () => {
  return (
    <Center h="80vh">
      <Flex w="45vw" minW="450px" direction="column">
        <Box mt="12" mb="10" mx="auto">
          <Image alt="not found" src={AlertIcon} width="170px" />
        </Box>
        <Heading mb={2} size="lg" textAlign="center">
          Oops... Something went wrong
        </Heading>
        <Text mb={10} textAlign="center">
          We cannot find the page, you're looking for.
        </Text>
      </Flex>
    </Center>
  );
};
