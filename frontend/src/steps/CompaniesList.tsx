import { EditIcon } from 'lucide-react';
import { SimpleGrid, Button, Text, Radio, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CompanySearch } from '../types';

type CompaniesListProps = {
  selectCompany: (searchRef: string | null) => void;
  companies: CompanySearch[];
};

const CompaniesList = (props: CompaniesListProps) => {
  const { selectCompany, companies } = props;

  const { t } = useTranslation();

  return (
    <Stack spacing="10" pt="2">
      <SimpleGrid columns={1} spacing="5">
        {companies.length === 0 ? (
          <Text pb="5">{t('steps.company_list.no_result')}</Text>
        ) : (
          companies.map((company: CompanySearch) => (
            <Button
              key={company.search_ref}
              variant="select"
              onClick={() => selectCompany(company.search_ref)}
              justifyContent="flex"
              isTruncated
              h="auto"
            >
              <Radio value="1" py="3">
                <Text textAlign="left" isTruncated>
                  {company.name}{' '}
                  {company.address?.postal_code &&
                    `(${company.address.postal_code})`}{' '}
                </Text>
                <Text color="gray.500" textAlign="left">
                  {company.registration_number}
                </Text>
              </Radio>
            </Button>
          ))
        )}
      </SimpleGrid>
      <Box>
        {companies.length > 0 && (
          <Text pb={5}>{t('steps.company_list.not_found')}</Text>
        )}
        <Button
          leftIcon={<EditIcon size="16" />}
          variant="fill"
          onClick={() => selectCompany(null)}
        >
          {t('steps.company_list.button')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CompaniesList;
