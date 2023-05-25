import { Flex, Text, VStack } from '@chakra-ui/react';
import { languages } from '../../config/languages';
import SelectLang from '../SelectLang';
import { ReactComponent as DotfileLogo } from '../../assets/dotfile.svg';
import { CopyableText } from '../copyable-text';
import { useTranslation } from 'react-i18next';

const Footer = ({ caseId }: { caseId: string | null | undefined }) => {
  const { t } = useTranslation();

  return (
    <VStack background="brand.sidebarBg" p="6" spacing="4" mt="auto">
      {caseId && (
        <CopyableText
          label={t('steps.checks_list.copy.label')}
          value={`${process.env.REACT_APP_BASE_URL}?caseId=${caseId}`}
        />
      )}
      {languages.length > 1 && <SelectLang />}
      <Flex alignItems="center">
        <Text
          color="brand.sidebarColor"
          mr="5px"
          fontSize="12px"
          lineHeight="2Opx"
          fontWeight="500"
          display="inline-block"
        >
          <b>Powered by</b>
        </Text>
        <DotfileLogo height="20px" />
      </Flex>
    </VStack>
  );
};

export default Footer;
