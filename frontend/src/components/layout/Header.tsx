import { Stack, Progress, Button, Box } from '@chakra-ui/react';
import { ChevronLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Title from '../Title';

type HeaderProps = {
  hasBackButton: boolean;
  isCheckStep: boolean;
  back: () => void;
  progress: number;
  title: string | null;
};

const Header = (props: HeaderProps) => {
  const { hasBackButton, isCheckStep, back, progress, title } = props;

  const { t } = useTranslation();

  return (
    <Stack spacing={8} pb={5}>
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
          <Progress maxWidth="80vv" value={progress} />
        )}
      </Box>
      {title && <Title value={title}></Title>}
    </Stack>
  );
};

export default Header;
