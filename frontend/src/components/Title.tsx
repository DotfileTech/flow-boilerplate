import { Box, Heading } from '@chakra-ui/react';

type TitleProps = {
  value: string;
};

const Title = ({ value }: TitleProps) => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        color="brand.primary"
        fontSize={{ base: '2xl', md: '3xl' }}
      >
        {value}
      </Heading>
    </Box>
  );
};

export default Title;
