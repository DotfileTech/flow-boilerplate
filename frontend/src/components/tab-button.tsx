import { Text, Box, Button, Icon } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';

type TabButtonProps = {
  entityName: string;
  tabIndex: number;
  onClick: any;
};

export const TabButton = (props: TabButtonProps) => {
  const { entityName, tabIndex, onClick } = props;

  return (
    <Box mt="6">
      <Text color="gray.600">Done completing this section ?</Text>
      <Button
        onClick={() => onClick(tabIndex)}
        variant="link"
        color="black"
        pt="1"
        lineHeight="6"
        rightIcon={<Icon size="16" as={ArrowRight} />}
      >
        Check {entityName} as well{' '}
      </Button>
    </Box>
  );
};
