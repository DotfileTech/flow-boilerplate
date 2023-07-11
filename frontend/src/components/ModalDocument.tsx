import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Button,
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  ModalFooter,
  Stack,
  FormLabel,
  FormHelperText,
  FormControl,
  Icon,
  Text,
  AlertIcon,
  Alert,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import { CheckTypeEnum } from '../constants';
import { Plus } from 'lucide-react';
import FileUpload from './form/FileUpload';
import { CheckInterface } from '../types';

type ModalDocumentProps = {
  currentCheck: CheckInterface;
  fetchMyAPI: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const ModalDocument = (props: ModalDocumentProps) => {
  const { currentCheck, fetchMyAPI, isOpen, onClose } = props;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setFiles([]);
  }, []);

  const api = useApi();

  const [fileFront, setFileFront] = useState<File>();
  const [fileBack, setFileBack] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);
  const [addFile, setAddFile] = useState<boolean>(true);

  const handleFileFront = async (event: any) => {
    setFileFront(event.target.files[0]);
  };

  const handleFileBack = async (event: any) => {
    setFileBack(event.target.files[0]);
  };

  const handleFiles = async (event: any) => {
    const combined = [...files, ...event.target.files];
    if (combined) {
      setAddFile(false);
      setFiles(combined);
    }
  };

  async function upload() {
    setIsLoading(true);
    const data = new FormData();

    data.append('checkId', currentCheck.id);
    data.append('type', currentCheck.type);

    if (currentCheck.type === CheckTypeEnum.document) {
      for (let i = 0; i < files.length; i++) {
        data.append('file[]', files[i]);
      }
      await api.post(`/dotfile/documents`, data);
      await fetchMyAPI();
      setIsLoading(false);
      onClose();
      setFiles([]);
    }

    if (currentCheck.type === CheckTypeEnum.id_document) {
      if (fileFront) {
        data.append('file[]', fileFront);
      }
      if (fileBack) {
        data.append('file[]', fileBack);
      }
      await api.post(`/dotfile/identity_documents`, data);
      await fetchMyAPI();
      setIsLoading(false);
      onClose();
      setFileFront(undefined);
      setFileBack(undefined);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefFront = useRef<HTMLInputElement>(null);
  const inputRefBack = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClickFront = () => {
    inputRefFront.current?.click();
  };

  const handleClickBack = () => {
    inputRefBack.current?.click();
  };

  const exactType =
    currentCheck.type === CheckTypeEnum.document && currentCheck.subtype
      ? currentCheck.subtype.split(':')[1]
      : currentCheck.type;

  // @NOTE Add a fallback title when a custom document type created after the onboarding flow init
  const checkTitleFallBack = useMemo(() => {
    if (
      currentCheck.type === CheckTypeEnum.document &&
      currentCheck.subtype.includes('custom_document_type')
    ) {
      return currentCheck.data.settings.custom_document_type.label;
    }
    // eslint-disable-next-line
  }, [currentCheck.type]);

  return (
    <Modal
      isOpen={isOpen}
      size={['full', 'full', 'xl']}
      onClose={() => {
        setFiles([]);
        onClose();
      }}
      isCentered
      scrollBehavior="inside"
      closeOnEsc={!isLoading}
      closeOnOverlayClick={!isLoading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t(`checks.${exactType}.title`, checkTitleFallBack as string)}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          {i18n.exists(`checks.${exactType}.callout`) && (
            <Alert status="info" mb="6">
              <AlertIcon />
              <Text
                dangerouslySetInnerHTML={{
                  __html: t(`checks.${exactType}.callout`) ?? '',
                }}
              ></Text>
            </Alert>
          )}
          <FormControl>
            <FormLabel>
              {t(`checks.${exactType}.title`, checkTitleFallBack as string)}
            </FormLabel>
            {i18n.exists(`checks.${exactType}.description`) && (
              <FormHelperText mt="0" mb="2">
                {t(`checks.${exactType}.description`)}
              </FormHelperText>
            )}
            {currentCheck.type === CheckTypeEnum.id_document && (
              <Box>
                <input
                  accept=".gif, .pdf, .jpeg, .png"
                  id="raised-button-file"
                  style={{ display: 'none' }}
                  ref={inputRefFront}
                  name={currentCheck.type}
                  required
                  onChange={handleFileFront}
                  type="file"
                />{' '}
                <FileUpload
                  onChange={handleClickFront}
                  value={
                    fileFront ? fileFront.name : t('upload_document_front')
                  }
                  isDisabled={!!fileFront}
                />
                <input
                  accept=".gif, .pdf, .jpeg, .png"
                  id="raised-button-file"
                  style={{ display: 'none' }}
                  ref={inputRefBack}
                  name={currentCheck.type}
                  required
                  onChange={handleFileBack}
                  type="file"
                />{' '}
                <FileUpload
                  onChange={handleClickBack}
                  value={fileBack ? fileBack.name : t('upload_document_back')}
                  isDisabled={!!fileBack}
                />
              </Box>
            )}

            {currentCheck.type === CheckTypeEnum.document && (
              <Box>
                <input
                  accept=".gif, .pdf, .jpeg, .png"
                  id="raised-button-file"
                  style={{ display: 'none' }}
                  ref={inputRef}
                  name={currentCheck.type}
                  required
                  onChange={handleFiles}
                  multiple
                  type="file"
                />
                {files.map((file: File, i: number) => (
                  <FileUpload
                    key={`file_${i}`}
                    onChange={handleClick}
                    value={
                      files && files.length > 0
                        ? files[i].name
                        : t('upload_document')
                    }
                    isDisabled={true}
                  />
                ))}
                {addFile && (
                  <FileUpload
                    onChange={handleClick}
                    value={t('upload_document')}
                  />
                )}
                {files.length < 5 && !addFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    colorScheme="gray"
                    leftIcon={<Icon as={Plus} />}
                    size="sm"
                    onClick={() => {
                      setAddFile(true);
                    }}
                  >
                    {t('document_add')}
                  </Button>
                )}
              </Box>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Stack direction={['column-reverse', 'row']} spacing={4}>
            <Button variant="outline" onClick={onClose}>
              {t('domain.form.cancel')}
            </Button>
            <Button
              variant="solid"
              isLoading={isLoading}
              isDisabled={files.length === 0 && fileFront === undefined}
              onClick={upload}
            >
              {t('send_documents')}
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDocument;
