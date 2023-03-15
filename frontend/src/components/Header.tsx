import { Stack, Progress, Button, Box } from '@chakra-ui/react'
import Title from '../components/Title'
import { ChevronLeftIcon } from '@chakra-ui/icons'

function Header(props: any) {
  return (
    <Stack spacing={8}>
      <Box>
        <Button
          pb={4}
          width="100px"
          variant="back"
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Progress maxWidth="80vv" value={props.progress} />
      </Box>
      <Title>{props.children}</Title>
    </Stack>
  )
}

export default Header
