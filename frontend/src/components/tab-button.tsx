import { Text, Box, Button, Icon } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TabButtonProps = {
  entityType: 'individual' | 'company';
  tabIndex: number;
  onClick: any;
};

export const TabButton = (props: TabButtonProps) => {
  const { entityType, tabIndex, onClick } = props;

  const { t } = useTranslation();

  return (
    <Box mt="6">
      <Text color="gray.600">{t('steps.checks_list.tab_button.content')}</Text>
      <Button
        onClick={() => onClick(tabIndex)}
        variant="link"
        color="black"
        pt="1"
        lineHeight="6"
        rightIcon={<Icon size="16" as={ArrowRight} />}
      >
        {entityType === 'company'
          ? t('steps.checks_list.tab_button.cta_company')
          : t('steps.checks_list.tab_button.cta_individual')}
      </Button>
    </Box>
  );
};
