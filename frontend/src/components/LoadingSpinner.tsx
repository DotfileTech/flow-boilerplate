import { Spinner, Center } from '@chakra-ui/react'

function LoadingSpinner(props: any) {
  return (
    <Center padding={10}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  )
}

export default LoadingSpinner
