import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Button,
  Box,
  Flex,
  Spacer,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  ModalFooter,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import { CheckTypeEnum } from '../constants';

const UploadDocuments = (props: any) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setFiles([]);
  }, []);

  const api = useApi();

  const [fileFront, setFileFront] = useState<File>();
  const [fileBack, setFileBack] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileFront = async (event: any) => {
    setFileFront(event.target.files[0]);
  };

  const handleFileBack = async (event: any) => {
    setFileBack(event.target.files[0]);
  };

  const handleFiles = async (event: any) => {
    const combined = [...files, ...event.target.files];
    if (combined) {
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
      props.setIsUpload(false);
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
      props.setIsUpload(false);
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
    if (props.currentCheck.data.settings.custom_document_type) {
      return props.currentCheck.data.settings.custom_document_type.label;
    }
    // eslint-disable-next-line
  }, [props.currentCheck.type]);

  return (
    <Modal
      isOpen={props.isUpload}
      size={['full', 'full', 'xl']}
      onClose={() => {
        setFiles([]);
        props.setIsUpload(false);
      }}
    >
      <ModalOverlay />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t(`checks.${exactType}.title`, 'Document')}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody padding={5}>
          <Text mb={5}>
            {t(`checks.${exactType}.title`, checkTitleFallBack)} {t(`for`)}{' '}
            {entityName}
          </Text>
          {i18n.exists(`checks.${exactType}.description`) && (
            <Text>{t(`checks.${exactType}.description`)}</Text>
          )}
          {props.currentCheck.type === CheckTypeEnum.id_document && (
            <Box paddingTop={5}>
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
              <Button variant="outline" onClick={handleClickFront}>
                {t('upload_document_front')}
              </Button>
              {fileFront && (
                <Flex alignItems="center" padding={5}>
                  <Text>{fileFront.name}</Text>
                  <Spacer />
                </Flex>
              )}
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
              <Button variant="outline" onClick={handleClickBack}>
                {t('upload_document_back')}
              </Button>
              {fileBack && (
                <Flex alignItems="center" padding={5}>
                  <Text>{fileBack.name}</Text>
                  <Spacer />
                </Flex>
              )}
            </Box>
          )}

          {props.currentCheck.type === CheckTypeEnum.document && (
            <Box paddingTop={5}>
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
              />{' '}
              <Button variant="outline" onClick={handleClick}>
                {t('upload_document')}
              </Button>
              {files &&
                files.length > 0 &&
                Array.from(files).map((file: any, i: number) => (
                  <Flex key={i} alignItems="center" padding={5}>
                    <Text>{file.name}</Text>
                    <Spacer />
                  </Flex>
                ))}
            </Box>
          )}
        </ModalBody>
        <ModalFooter alignItems="center">
          <Button
            variant="next"
            isLoading={isLoading}
            isDisabled={files.length === 0 && fileFront === undefined}
            onClick={upload}
          >
            {t('send_documents')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadDocuments;
