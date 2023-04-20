import { EditIcon } from '@chakra-ui/icons';
import { SimpleGrid, Button, Text, Radio, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CompanySearch = (props: any) => {
  const { t } = useTranslation();
  console.log(props.companies);

  return (
    <Stack spacing={10} pt={2}>
      <SimpleGrid columns={1} spacing={5}>
        {props.companies.map((company: any, i: number) => (
          <Button
            key={i}
            variant="select"
            onClick={() => props.selectCompany(company.search_ref)}
            justifyContent="flex"
            isTruncated
            h="auto"
          >
            <Radio value="1" py="3">
              <Text textAlign="left" isTruncated>
                {company.name}{' '}
                {company.address.postal_code &&
                  `(${company.address.postal_code})`}{' '}
              </Text>
              <Text color="gray.500" textAlign="left">
                {company.registration_number}
              </Text>
            </Radio>
          </Button>
        ))}
      </SimpleGrid>
      <Box>
        <Text pb={5}>{t('steps.company_list.not_found')}</Text>
        <Button
          leftIcon={<EditIcon />}
          variant="fill"
          onClick={() => props.selectCompany(null)}
        >
          {t('steps.company_list.button')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CompanySearch;
