import { Heading, Text, Center, Flex, Box, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UnderReviewImage } from '../assets/under-review-image';

export const UnderReview = () => {
  const { t } = useTranslation();
  const [accentColor] = useToken('colors', ['brand.secondary']);

  return (
    <Center mt={4}>
      <Flex direction="column">
        <Box mx="auto" mt={8} mb={10}>
          <UnderReviewImage color={accentColor} />
        </Box>
        <Heading mb={2} size="md" textAlign="center">
          {t('steps.checks_list.under_review.title')}
        </Heading>
        <Text
          mb={10}
          textAlign="center"
          color="gray.500"
          dangerouslySetInnerHTML={{
            __html: t('steps.checks_list.under_review.description') ?? '',
          }}
        ></Text>
      </Flex>
    </Center>
  );
};
