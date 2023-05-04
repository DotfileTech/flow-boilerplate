import { Box, Heading } from '@chakra-ui/react';

type TitleProps = {
  value: string;
};

const Title = ({ value }: TitleProps) => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        color="brand.main-3"
        fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
      >
        {value}
      </Heading>
    </Box>
  );
};

export default Title;
