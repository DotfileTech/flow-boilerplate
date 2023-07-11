import { useCallback, useEffect } from 'react';
import { useClipboard, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const useCopyToClipBoard = (value: string): (() => void) => {
  const toast = useToast();
  const { onCopy, setValue } = useClipboard(value);

  const { t } = useTranslation();

  // Value must be manually synchronized to useClipboard using setValue
  // @see https://chakra-ui.com/docs/hooks/use-clipboard
  useEffect(() => {
    setValue(value);
  }, [setValue, value]);

  const copyToClipBoard = useCallback(() => {
    onCopy();
    toast({
      variant: 'toast_success',
      title: t('domain.toast.copy_to_clip_board.title'),
      description: `'${value}' ${t(
        'domain.toast.copy_to_clip_board.description'
      )}`,
      status: 'success',
      isClosable: false,
      position: 'bottom-right',
      duration: 3000,
    });
  }, [onCopy, toast, value]);

  return copyToClipBoard;
};
