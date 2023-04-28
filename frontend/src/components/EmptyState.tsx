import { Heading, Text, Center, Flex, Box, Button } from '@chakra-ui/react';
import { EmptyStateImage } from './assets/empty-state-image';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonAction?: () => void;
  hideIllustration?: boolean;
}

/**
 * We have to use this component when the result of a filtering is empty
 * or for example when it is a new connection and the workflows, submissions, apiKeys... are empty.
 */
export const EmptyState = ({
  title,
  description,
  buttonAction,
  buttonLabel,
  hideIllustration,
}: EmptyStateProps): JSX.Element => {
  return (
    <Center data-testid="empty-state" mt={4}>
      <Flex direction="column">
        {!hideIllustration && (
          <Box mt={8} mb={10}>
            <EmptyStateImage />
          </Box>
        )}
        {title && (
          <Heading mb={2} size="lg" textAlign="center">
            {title}
          </Heading>
        )}
        {description && (
          <Text mb={10} textAlign="center" color="gray.500">
            {description}
          </Text>
        )}
        {!!buttonLabel && !!buttonAction && (
          <Center>
            <Button onClick={buttonAction} data-testid="emptyState-button">
              {buttonLabel}
            </Button>
          </Center>
        )}
      </Flex>
    </Center>
  );
};
