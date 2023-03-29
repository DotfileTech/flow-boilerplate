import { SimpleGrid, Button, Text, Radio, Stack } from '@chakra-ui/react'

function CustomRadio(props: any) {
  const changeHandlerMetadata = (label: string) => {
    props.changeHandlerMetadataCustom(props.question, label)
    props.next()
  }

  return (
    <Stack spacing={10} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {props.choices.map((item: any, i: any) => (
          <Button
            key={i}
            variant="select"
            name={item.value}
            value={item.value}
            onClick={() => changeHandlerMetadata(item)}
            justifyContent="flex"
            isTruncated
          >
            <Radio value="1">
              <Text isTruncated>{item}</Text>
            </Radio>
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default CustomRadio
