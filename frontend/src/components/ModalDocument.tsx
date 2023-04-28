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
  HStack,
  FormLabel,
  FormHelperText,
  FormControl,
  Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import { CheckTypeEnum } from '../constants';
import { Plus } from 'lucide-react';
import FileUpload from './FileUpload';

const ModalDocument = (props: any) => {
  const { isOpen, onClose } = props;
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

    data.append('checkId', props.currentCheck.id);
    data.append('type', props.currentCheck.type);

    if (props.currentCheck.type === CheckTypeEnum.document) {
      for (let i = 0; i < files.length; i++) {
        data.append('file[]', files[i]);
      }
      await api.post(`/dotfile/documents`, data);
      await props.fetchMyAPI();
      setIsLoading(false);
      onClose();
      setFiles([]);
    }

    if (props.currentCheck.type === CheckTypeEnum.id_document) {
      if (fileFront) {
        data.append('file[]', fileFront);
      }
      if (fileBack) {
        data.append('file[]', fileBack);
      }
      await api.post(`/dotfile/identity_documents`, data);
      await props.fetchMyAPI();
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
    props.currentCheck.type === CheckTypeEnum.document
      ? props.currentCheck.subtype.split(':')[1]
      : props.currentCheck.type;

  const entityName = props.currentIndividual.name
    ? props.currentIndividual.name
    : `${props.currentIndividual.first_name} ${props.currentIndividual.last_name}`;

  // @NOTE Add a fallback title when a custom document type created after the onboarding flow init
  const checkTitleFallBack = useMemo(() => {
    if (
      props.currentCheck.type === CheckTypeEnum.document &&
      props.currentCheck.data.settings.custom_document_type
    ) {
      return props.currentCheck.data.settings.custom_document_type.label;
    }
    // eslint-disable-next-line
  }, [props.currentCheck.type]);

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
        <ModalHeader>{entityName}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <FormControl>
            <FormLabel>
              {props.currentCheck &&
                t(`checks.${exactType}.title`, checkTitleFallBack)}
            </FormLabel>
            {i18n.exists(`checks.${exactType}.description`) && (
              <FormHelperText mt="0" mb="2">
                {t(`checks.${exactType}.description`)}
              </FormHelperText>
            )}
            {props.currentCheck.type === CheckTypeEnum.id_document && (
              <Box>
                <input
                  accept=".gif, .pdf, .jpeg, .png"
                  id="raised-button-file"
                  style={{ display: 'none' }}
                  ref={inputRefFront}
                  name={props.currentCheck.type}
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
                  name={props.currentCheck.type}
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

            {props.currentCheck.type === CheckTypeEnum.document && (
              <Box>
                <input
                  accept=".gif, .pdf, .jpeg, .png"
                  id="raised-button-file"
                  style={{ display: 'none' }}
                  ref={inputRef}
                  name={props.currentCheck.type}
                  required
                  onChange={handleFiles}
                  multiple
                  type="file"
                />
                {files.map((file: any, i: number) => (
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
          <HStack spacing={4}>
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
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDocument;
