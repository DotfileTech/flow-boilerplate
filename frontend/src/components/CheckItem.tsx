import { Tag, Heading, Flex, Spacer, Button, Show, Text, Box } from '@chakra-ui/react';
import { DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import { CheckResultEnum, CheckStatusEnum, CheckTypeEnum } from '../constants';

const CheckItem = (props: any) => {
  const { t } = useTranslation();

  const exactType = (currentCheck: any) => {
    return currentCheck.type === CheckTypeEnum.document
      ? currentCheck.subtype.split(':')[1]
      : currentCheck.type;
  };

  return (
    <Box px="4" py="6" width="100%">
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        alignItems="center"
      >
        <Show above="sm">
          <Heading size="sm">
            {props.check && t(`checks.${exactType(props.check)}.title`)}
          </Heading>
        </Show>

        <Spacer />

        {props.check.status === CheckStatusEnum.rejected && (
          <Tag mr={5} colorScheme="red">
            {t('domain.check.status.rejected')}
          </Tag>
        )}
        {props.check.status === CheckStatusEnum.approved && (
          <Tag mr={5} colorScheme="green">
            {t('domain.check.status.approved')}
          </Tag>
        )}
        {(props.check.status === CheckStatusEnum.need_review || props.check.status === CheckStatusEnum.processing) && (
          <Tag mr={5} colorScheme="blue">
            {t('domain.check.status.need_review')}
          </Tag>
        )}
        {props.check.status === CheckStatusEnum.expired && (
          <Tag mr={5} colorScheme="yellow">
            {t('domain.check.status.expired')}
          </Tag>
        )}

        <>
          <Button
            leftIcon={
              props.check.type === CheckTypeEnum.id_verification ? (
                <ExternalLinkIcon />
              ) : (
                <DownloadIcon />
              )
            }
            width={['100%', 'auto', 'auto']}
            id={props.check.id}
            name={props.check.type}
            variant="outline"
            onClick={() => {
              props.selectCheck(props.check)
              props.setCurrentIndividual(props.item)
            }}
            isDisabled={
              props.check.status !== CheckStatusEnum.in_progress &&
              props.check.data.result !== CheckResultEnum.rejected
            }
            mt={{ base: '12px', md: '0' }}
          >
            <Show below="sm">
              {props.check && t(`checks.${exactType(props.check)}.title`)}
            </Show>

            <Show above="sm">
              {props.check.data.result === CheckResultEnum.rejected
                ? t('upload_document')
                : props.check.status === CheckStatusEnum.in_progress
                ? props.check.type === CheckTypeEnum.id_verification
                  ? t('verify_identity')
                  : t('upload_document')
                : t('upload_document')}
            </Show>
          </Button>
        </>
      </Flex>
      {props.check.status === 'rejected' && (
        <Text color="red.600" mt={{ base: '12px', md: '0' }}>{props.check.data.review.comment}</Text>
      )}
    </Box>
  );
};

export default CheckItem;
