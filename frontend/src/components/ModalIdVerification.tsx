import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  Text,
  AlertIcon,
  Alert,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { CheckInterface } from '../types';
import { UbbleIframe } from './iframe';
import { useLoadSDK } from '../hooks/use-load-sdk';
import { Loader } from 'lucide-react';
import { useCallback } from 'react';

type ModalIdVerificationProps = {
  currentCheck: CheckInterface;
  isOpen: boolean;
  onClose: () => void;
  fetchMyAPI: () => void;
};

const ModalIdVerification = (props: ModalIdVerificationProps) => {
  const { currentCheck, isOpen, onClose, fetchMyAPI } = props;

  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { loaded: sdkLoaded } = useLoadSDK();

  const onComplete = useCallback(async () => {
    fetchMyAPI();
    onClose();
  }, []);

  const onAbort = useCallback(async () => {
    toast({
      variant: 'toast_warning',
      title: 'Identity verification aborted',
      description:
        'You have aborted your identity verification, contact us to begin a new verification.',
      status: 'warning',
      isClosable: false,
      position: 'bottom-right',
      duration: 3000,
    });

    onClose();
  }, []);

  const onExpired = useCallback(async () => {
    toast({
      variant: 'toast_warning',
      title: 'Identity verification expired',
      description:
        'Your identity verification has expired, contact us to begin a new verification.',
      status: 'warning',
      isClosable: false,
      position: 'bottom-right',
      duration: 3000,
    });

    onClose();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onClose={() => {
        onClose();
      }}
      isCentered
      scrollBehavior="inside"
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('verify_identity')}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody position="relative">
          {i18n.exists(`checks.id_verification.callout`) && (
            <Alert status="info" mb="6">
              <AlertIcon />
              <Text
                dangerouslySetInnerHTML={{
                  __html: t(`checks.id_verification.callout`) ?? '',
                }}
              ></Text>
            </Alert>
          )}

          {sdkLoaded ? (
            <UbbleIframe
              url={currentCheck.data.vendor.verification_url}
              onComplete={onComplete}
              onAbort={onAbort}
              onExpired={onExpired}
            />
          ) : (
            <Loader />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalIdVerification;
