import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { EditIcon } from 'lucide-react';
import { SimpleGrid, Button, Text, Radio, Stack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { CompanySearch } from '../types';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';

type CompaniesListProps = {
  company: any;
  setCompany: Dispatch<SetStateAction<any>>;
  selectCompany: (searchRef: string | null) => void;
  back: () => void;
};

const CompaniesList = (props: CompaniesListProps) => {
  const { company, setCompany, selectCompany, back } = props;

  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const api = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<CompanySearch[]>([]);

  const getCompanies = async () => {
    const params = {
      country: company.country,
      ...(company.registration_number && {
        registration_number: company.registration_number,
      }),
      ...(company.name && {
        name: company.name,
      }),
    };

    const response = await api.get(
      `dotfile/companies?${new URLSearchParams(params).toString()}`
    );

    if (
      response.data.data.length === 0 &&
      searchParams.get('registrationNumber') &&
      company.registration_number
    ) {
      // Go to the search company step when the registration number in query param is bad
      setCompany({
        name: searchParams.get('company'),
        country: searchParams.get('country'),
        registration_number: null,
      });
      back();
    } else if (response.data.data.length > 0) {
      setCompanies(response.data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
