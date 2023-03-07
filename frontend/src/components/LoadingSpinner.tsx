import { Spinner } from '@chakra-ui/react'

function LoadingSpinner(props: any) {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  )
}

export default LoadingSpinner
