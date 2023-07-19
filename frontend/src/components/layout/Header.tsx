import { Progress, Button, Box, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Title from '../Title';

type HeaderProps = {
  hasBackButton: boolean;
  isCheckStep: boolean;
  back: () => void;
  progress: number;
  title: string | null;
  subtitle: string | null;
};

const Header = (props: HeaderProps) => {
  const { hasBackButton, isCheckStep, back, progress, title, subtitle } = props;

  const { t } = useTranslation();

  return (
    <Box>
      <Box>
        {hasBackButton && (
          <Button
            pb={4}
            width="100px"
            variant="back"
            onClick={back}
            leftIcon={<ChevronLeftIcon size={16} />}
          >
            {t('domain.back')}
          </Button>
        )}
        {progress <= 100 && !isCheckStep && (
          <Progress maxWidth="80vv" value={progress} mb="8" />
        )}
      </Box>
      {title && <Title value={title}></Title>}
      {subtitle && (
        <Text
          mt="5"
          dangerouslySetInnerHTML={{
            __html: t(subtitle) ?? '',
          }}
        ></Text>
      )}
    </Box>
  );
};

export default Header;
