import { Stack, Progress, Button, Box } from '@chakra-ui/react';
import { ChevronLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Title from '../components/Title';

const Header = (props: any) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={8} pb={5}>
      <Box>
        {props.hasBackButton && (
          <Button
            pb={4}
            width="100px"
            variant="back"
            onClick={props.back}
            leftIcon={<ChevronLeftIcon size={16} />}
          >
            {t('domain.back')}
          </Button>
        )}
        {props.progress <= 100 && (
          <Progress maxWidth="80vv" value={props.progress} />
        )}
      </Box>
      <Title>{props.children}</Title>
    </Stack>
  );
};

export default Header;
