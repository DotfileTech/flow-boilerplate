import { useCallback, useEffect } from 'react';
import { useClipboard, useToast } from '@chakra-ui/react';

export const useCopyToClipBoard = (value: string): (() => void) => {
  const toast = useToast();
  const { onCopy, setValue } = useClipboard(value);

  // Value must be manually synchronized to useClipboard using setValue
  // @see https://chakra-ui.com/docs/hooks/use-clipboard
  useEffect(() => {
    setValue(value);
  }, [setValue, value]);

  const copyToClipBoard = useCallback(() => {
    onCopy();
    toast({
      variant: 'toast_success',
      title: 'Copied!',
      description: `'${value}' has been successfully copied`,
      status: 'success',
      isClosable: false,
      position: 'bottom-right',
      duration: 3000,
    });
  }, [onCopy, toast, value]);

  return copyToClipBoard;
};
