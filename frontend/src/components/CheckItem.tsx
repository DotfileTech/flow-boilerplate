import { useMemo } from 'react';
import {
  Tag,
  Heading,
  Flex,
  Spacer,
  Button,
  Show,
  Text,
  Box,
} from '@chakra-ui/react';
import {
  DownloadIcon,
  ExternalLinkIcon,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Timer,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { CheckResultEnum, CheckStatusEnum, CheckTypeEnum } from '../constants';

type CheckItemProps = {
  item: any;
  check: any;
  selectCheck: any;
  setCurrentIndividual: any;
  onOpen: any;
};

const CheckItem = (props: CheckItemProps) => {
  const { check, selectCheck, setCurrentIndividual, item, onOpen } = props;
  const { t } = useTranslation();

  const exactType = (currentCheck: any) => {
    return currentCheck.type === CheckTypeEnum.document
      ? currentCheck.subtype.split(':')[1]
      : currentCheck.type;
  };

  // @NOTE Add a fallback title when a custom document type created after the onboarding flow init
  const checkTitleFallBack = useMemo(() => {
    if (
      check.type === CheckTypeEnum.document &&
      check.data.settings.custom_document_type
    ) {
      return check.data.settings.custom_document_type.label;
    }
    // eslint-disable-next-line
  }, [check.type]);

  return (
    <Box px="4" py="6" width="100%">
      <Flex direction={{ base: 'column', sm: 'row' }} alignItems="center">
        <Show above="sm">
          <Heading size="sm">
            {check && t(`checks.${exactType(check)}.title`, checkTitleFallBack)}
          </Heading>
        </Show>

        <Spacer />

        {check.status === CheckStatusEnum.rejected && (
          <Tag mr={5} colorScheme="red">
            <Box as="span" mr="2">
              <XCircle size={16} />
            </Box>
            {t('domain.check.status.rejected')}
          </Tag>
        )}
        {check.status === CheckStatusEnum.approved && (
          <Tag mr={5} colorScheme="green">
            <Box as="span" mr="2">
              <CheckCircle2 size={16} />
            </Box>
            {t('domain.check.status.approved')}
          </Tag>
        )}
        {(check.status === CheckStatusEnum.need_review ||
          check.status === CheckStatusEnum.processing) && (
          <Tag mr={5} colorScheme="blue">
            <Box as="span" mr="2">
              <PlayCircle size={16} />
            </Box>
            {t('domain.check.status.need_review')}
          </Tag>
        )}
        {check.status === CheckStatusEnum.expired && (
          <Tag mr={5} colorScheme="yellow">
            <Box as="span" mr="2">
              <Timer size={16} />
            </Box>
            {t('domain.check.status.expired')}
          </Tag>
        )}

        <>
          <Button
            leftIcon={
              check.type === CheckTypeEnum.id_verification ? (
                <ExternalLinkIcon size={16} />
              ) : (
                <DownloadIcon size={16} />
              )
            }
            width={['100%', 'auto', 'auto']}
            id={check.id}
            name={check.type}
            variant="outline"
            onClick={() => {
              selectCheck(check);
              setCurrentIndividual(item);
              onOpen();
            }}
            isDisabled={
              check.status !== CheckStatusEnum.in_progress &&
              check.data.result !== CheckResultEnum.rejected
            }
            mt={{ base: '12px', md: '0' }}
          >
            <Show below="sm">
              {check &&
                t(`checks.${exactType(check)}.title`, checkTitleFallBack)}
            </Show>

            <Show above="sm">
              {check.data.result === CheckResultEnum.rejected
                ? t('upload_document')
                : check.status === CheckStatusEnum.in_progress
                ? check.type === CheckTypeEnum.id_verification
                  ? t('verify_identity')
                  : t('upload_document')
                : t('upload_document')}
            </Show>
          </Button>
        </>
      </Flex>
      {check.status === 'rejected' && (
        <Text color="red.600" mt={{ base: '12px', md: '0' }}>
          {check.data.review.comment}
        </Text>
      )}
    </Box>
  );
};

export default CheckItem;
