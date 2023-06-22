import { Button, Icon } from '@chakra-ui/react';
import { Copy } from 'lucide-react';
import { useCopyToClipBoard } from '../hooks/use-copy-to-clipboard';

type CopyableTextProps = {
  label: string;
  value: string;
};

export const CopyableText = (props: CopyableTextProps): JSX.Element => {
  const { label, value } = props;

  const copyToClipBoard = useCopyToClipBoard(value);

  return (
    <Button
      variant="link"
      rightIcon={<Icon size="16" as={Copy} />}
      onClick={() => copyToClipBoard()}
      color={{ base: 'sidebar.color', md: 'gray.500' }}
    >
      {label}
    </Button>
  );
};
