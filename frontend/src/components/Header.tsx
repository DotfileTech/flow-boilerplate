import { Stack, Progress, Button, Box } from '@chakra-ui/react'
import Title from '../components/Title'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'

function Header(props: any) {
  const { t } = useTranslation()

  return (
    <Stack spacing={8} pb={5}>
      <Box>
        {props.hasBackButton && (
          <Button
            pb={4}
            width="100px"
            variant="back"
            onClick={props.back}
            leftIcon={<ChevronLeftIcon />}
          >
            {t('back')}
          </Button>
        )}
        <Progress maxWidth="80vv" value={props.progress} />
      </Box>
      <Title>{props.children}</Title>
    </Stack>
  )
}

export default Header
