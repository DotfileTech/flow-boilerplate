import { Tag, Heading, Flex, Spacer, Button, Show } from '@chakra-ui/react'
import { DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'

function CheckItem(props: any) {
  const exactType = (currentCheck: any) => {
    return currentCheck.type === 'document'
      ? currentCheck.subtype.split(':')[1]
      : currentCheck.type
  }

  const { t } = useTranslation()
  return (
    <Flex
      pb={[1, 2, 2]}
      direction={{ base: 'column', sm: 'row' }}
      alignItems="center"
    >
      {/* <Spacer /> */}
      {/* {check.data.result} {check.data.review.comment} */}
      {/* <Spacer /> */}

      <Show above="sm">
        <Heading size="sm">
          {props.check && t(`checks.${exactType(props.check)}.title`)}
        </Heading>
      </Show>

      <Spacer />

      {props.check.data.result === 'approved' && (
        <Tag colorScheme="green">{t('approved')}</Tag>
      )}

      {props.check.status === 'need_review' && (
        <Tag colorScheme="gray">{t('need_review')}</Tag>
      )}

      {props.check.data.result === 'rejected' && (
        <Tag mr={5} colorScheme="red">
          {t('rejected')}
        </Tag>
      )}

      {(props.check.data.result === 'rejected' ||
        props.check.status === 'in_progress') && (
        <>
          <Button
            leftIcon={
              props.check.type === 'id_verification' ? (
                <ExternalLinkIcon />
              ) : (
                <DownloadIcon />
              )
            }
            width={["100%","",""]}
            id={props.check.id}
            name={props.check.type}
            variant="outline"
            onClick={() => {
              props.selectCheck(props.check)
              props.setCurrentIndividual(props.item)
            }}
            isDisabled={
              props.check.status !== 'in_progress' &&
              props.check.data.result !== 'rejected'
            }
          >
            <Show below="sm">
              {props.check && t(`checks.${exactType(props.check)}.title`)}
            </Show>

            <Show above="sm">
              {props.check.data.result === 'rejected'
                ? t('upload_document')
                : props.check.status === 'in_progress'
                ? props.check.type === 'id_verification'
                  ? t('verify_identity')
                  : t('upload_document')
                : t('upload_document')}
            </Show>
          </Button>
        </>
      )}
    </Flex>
  )
}

export default CheckItem
