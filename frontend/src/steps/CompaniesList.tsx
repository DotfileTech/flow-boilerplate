import { EditIcon } from '@chakra-ui/icons';
import { SimpleGrid, Button, Text, Radio, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CompanySearch = (props: any) => {
  const { t } = useTranslation();

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
          >
            <Radio value="1">
              <Text isTruncated>
                {company.name} - {company.registration_number}
              </Text>
            </Radio>
          </Button>
        ))}
      </SimpleGrid>
      <Box>
        <Text pb={5}>{t('company_not_found')}</Text>
        <Button
          leftIcon={<EditIcon />}
          variant="fill"
          onClick={() => props.selectCompany(null)}
        >
          {t('fill_manually')}
        </Button>
      </Box>
    </Stack>
  );
}

export default CompanySearch;
