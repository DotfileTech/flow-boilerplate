import { Box, Icon, Text } from '@chakra-ui/react';
import { UploadCloud } from 'lucide-react';

type FileUploadProps = {
  onChange: any;
  value: string;
  isDisabled?: boolean;
};

const FileUpload = (props: FileUploadProps) => {
  const { onChange, value, isDisabled = false } = props;

  return (
    <Box
      onClick={(e) => {
        if (!isDisabled) {
          onChange(e);
        }
      }}
      __css={{
        display: 'flex',
        flex: '1',
        h: '100',
        mb: '4',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4',
        borderWidth: '3px',
        borderRadius: 'base',
        borderStyle: 'dashed',
        borderColor: 'gray.200',
        color: 'gray.500',
        backgroundColor: 'gray.50',
        outline: 'none',
        transition: 'border 0.24s ease-in-out',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        bg: 'gray.50',
        _focus: {
          borderColor: isDisabled ? 'gray.200' : 'gray.400',
          bg: 'gray.50',
        },
        _hover: {
          borderColor: isDisabled ? 'gray.200' : 'gray.400',
          bg: 'gray.50',
        },
      }}
    >
      <Icon w="5" h="5" as={UploadCloud} />
      <Text lineHeight="24px">{value}</Text>
    </Box>
  );
};

export default FileUpload;
