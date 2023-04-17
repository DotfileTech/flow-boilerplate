import { SimpleGrid, Button, Text, Radio, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CustomRadio = (props: any) => {
  const { t } = useTranslation();
  const changeHandlerMetadata = (label: string) => {
    props.changeHandlerMetadataCustom(props.question, label);
    props.next();
  };

  return (
    <Stack spacing={10} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {props.choices.map((item: any, i: number) => (
          <Button
            key={i}
            variant="select"
            onClick={() => changeHandlerMetadata(item)}
            justifyContent="flex"
            isTruncated
          >
            <Radio value="1">
              <Text isTruncated>{t(`steps.${props.question}.${item}`)}</Text>
            </Radio>
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default CustomRadio;
