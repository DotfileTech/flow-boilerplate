import { useState, useEffect, ReactElement } from 'react';
import { Stack, Flex, Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/layout/Header';
import MobileHeader from './components/layout/MobileHeader';
import CompanySearch from './steps/CompanySearch';
import CompaniesList from './steps/CompaniesList';
import CustomForm from './steps/CustomForm';
import CompanyEdit from './steps/CompanyEdit';
import IndividualEdit from './steps/IndividualEdit';
import IndividualsList from './steps/IndividualsList';
import ChecksList from './steps/ChecksList';
import useApi from './hooks/useApi';
import { form } from './config/Forms';
import { hasKyb, hasKyc } from './config/step';
import {
  CompanySearch as CompanySearchType,
  Country,
  CustomField,
  FormData,
} from './types';

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const api = useApi();

  const email = searchParams.get('email');
  // @TODO - OF-28 - Remove sid (salesforceId)
  const sid = searchParams.get('sid');

  const [caseId, setCaseId] = useState<string | undefined | null>(
    searchParams.get('new') === 'true'
      ? undefined
      : searchParams.get('caseId') || localStorage.getItem('caseId')
  );
  const [step, setStep] = useState<number>(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [companiesSearch, setCompaniesSearch] = useState<CompanySearchType[]>(
    []
  );
  const [individuals, setIndividuals] = useState<any>([]);
  const [individual, setIndividual] = useState<any>({});
  const [metadata, setMetadata] = useState<{ [key: string]: string | null }>({
    email,
    sid,
  });
  const [company, setCompany] = useState<any>();
  const [individualIndex, setIndividualIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autoSearchDone, setAutoSearchDone] = useState<boolean>(false);
  const [individualsValid, setIndividualsValid] = useState<boolean>(true);

  async function fetchMyAPI() {
    const externalId = searchParams.get('externalId');
    if (externalId) {
      const response = await api.get(`/dotfile/cases?externalId=${externalId}`);

      if (response.data.id) {
        setCaseId(response.data.id);
        setStep(steps.findIndex((element) => element.key === 'checks_list'));
      }
    }

    if (caseId) {
      setStep(steps.findIndex((element) => element.key === 'checks_list'));
    }

    if (!caseId) {
      const response = await api.get('/dotfile/countries');
      setCountries(response.data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  useEffect(() => {
    if (hasKyb) {
      setCompany({
        name: searchParams.get('company'),
        country: searchParams.get('country'),
        registration_number: searchParams.get('registrationNumber'),
      });
    }
  }, [searchParams]);

  const next = async () => {
    setStep(step + 1);
  };

  const submit = async () => {
    setIsLoading(true);
    metadata.locale = i18next.languages[0];
    const response = await api.post(`dotfile/cases`, {
      company,
      individuals,
      email,
      metadata,
      externalId: searchParams.get('externalId'),
    });
    localStorage.setItem('caseId', response.data.caseId);

    // redirect to the completion step with the caseId query param
    const url = new URL(window.location.origin);
    url.searchParams.set('caseId', response.data.caseId);
    window.location.href = url.href;
  };

  const back = async () => {
    if (steps.findIndex((step) => step.key === 'company_edit')) {
      setCompany({
        ...company,
        registration_number: null,
      });
    }
    setStep(step - 1);
  };

  const getCompanies = async () => {
    try {
      setIsLoading(true);

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

      setAutoSearchDone(true);

      if (
        response.data.data.length === 0 &&
        searchParams.get('registrationNumber')
      ) {
        setStep(step);
        setCompany({
          name: searchParams.get('company'),
          country: searchParams.get('country'),
          registration_number: null,
        });
      } else if (response.data.data.length > 0) {
        setCompaniesSearch(response.data.data);
        setStep(steps.findIndex((step) => step.key === 'company_list'));
      } else {
        setStep(steps.findIndex((step) => step.key === 'company_list'));
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const selectCompany = async (searchRef: string | null) => {
    if (searchRef === null) {
      setIndividuals([]);
      setStep(steps.findIndex((step) => step.key === 'company_edit'));
    } else {
      setIsLoading(true);
      const response = await api.get(`/dotfile/companies/${searchRef}`);
      setCompany(response.data);
      setIndividuals(response.data.merged_individuals);
      setIsLoading(false);
      setStep(steps.findIndex((step) => step.key === 'company_edit'));
    }
  };

  const changeHandler = (e: any, nested: string | undefined) => {
    if (nested) {
      if (nested === 'classifications') {
        setCompany({
          ...company,
          [nested]: [
            {
              [e.target.name]: e.target.value,
            },
          ],
        });
      } else {
        setCompany({
          ...company,
          [nested]: {
            ...company[nested],
            [e.target.name]: e.target.value,
          },
        });
      }
    } else {
      setCompany({
        ...company,
        [e.target.name]: e.target.value,
      });
    }
  };

  const selectIndividual = (i: number | null) => {
    if (i === null) {
      setIndividual({});
      setIndividualIndex(null);
    } else {
      setIndividualIndex(i);
      setIndividual(individuals[i]);
    }
    setStep(steps.findIndex((step) => step.key === 'individual_edit'));
  };

  const changeHandlerMetadata = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const changeHandlerMetadataCustom = (question: string, answer: string) => {
    setMetadata({ ...metadata, [question]: answer });
  };

  const saveIndividual = () => {
    individual.isValid = true;
    if (individualIndex !== null) {
      individuals[individualIndex] = individual;
    } else {
      individuals.push(individual);
    }

    setIndividualsValid(
      !individuals.some((e: { isValid: boolean }) => !e.isValid)
    );

    setStep(hasKyb ? step - 1 : step + 1);
  };

  const steps: { key: string; content: ReactElement }[] = [];

  if (hasKyb && !caseId) {
    steps.push(
      {
        key: 'company_search',
        content: (
          <CompanySearch
            countries={countries}
            company={company}
            getCompanies={getCompanies}
            isLoading={isLoading}
            autoSearchDone={autoSearchDone}
            onChange={changeHandler}
          />
        ),
      },
      {
        key: 'company_list',
        content: (
          <CompaniesList
            selectCompany={selectCompany}
            companies={companiesSearch}
          />
        ),
      },
      {
        key: 'company_edit',
        content: (
          <CompanyEdit
            company={company}
            onChange={changeHandler}
            next={next}
            countries={countries}
          />
        ),
      },
      {
        key: 'individuals_list',
        content: (
          <IndividualsList
            selectIndividual={selectIndividual}
            individuals={individuals}
            setIndividuals={setIndividuals}
            submit={submit}
            individualsValid={individualsValid}
            setIndividualsValid={setIndividualsValid}
          />
        ),
      }
    );
  }

  if (hasKyc && !caseId) {
    steps.push({
      key: 'individual_edit',
      content: (
        <IndividualEdit
          individual={individual}
          setIndividual={setIndividual}
          saveIndividual={saveIndividual}
          countries={countries}
        />
      ),
    });
  }

  if (caseId) {
    steps.push({
      key: 'checks_list',
      content: <ChecksList caseId={caseId} />,
    });
  }

  if (!caseId) {
    // @ts-expect-error - type error to fix
    form.forEach((item: FormData) => {
      const content = (
        <CustomForm
          stepId={item.key}
          fields={item.fields}
          metadata={metadata}
          changeHandlerMetadata={changeHandlerMetadata}
          changeHandlerMetadataCustom={changeHandlerMetadataCustom}
          countries={countries}
          isLastStep={item.isLastStep || false}
          submit={submit}
          next={next}
        />
      );

      if (!item.after) {
        steps.unshift({
          key: item.key,
          content,
        });
      } else {
        const index =
          steps.findIndex((element) => element.key === item.after) + 1;
        steps.splice(index, 0, {
          key: item.key,
          content,
        });
      }
    });
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }}>
      <MobileHeader />
      <Sidebar />
      <Flex width="100%" ml={['0', '0', '25vw']}>
        <Stack
          width="100%"
          maxW={{ base: 'auto', md: '880px' }}
          py={[5, 10, 10]}
          pl={[5, 5, 20]}
          pr={[5, 5, 5]}
        >
          <Stack spacing={4}>
            <Header
              back={back}
              progress={(step / (steps.length - 1)) * 100}
              hasBackButton={step !== 0 && !caseId}
              isCheckStep={!!caseId}
              title={t(`steps.${steps[step].key}.title`)}
            />
            {i18n.exists(`steps.${steps[step].key}.description`) && (
              <Text
                dangerouslySetInnerHTML={{
                  __html: t(`steps.${steps[step].key}.description`),
                }}
              ></Text>
            )}
            {isLoading && <LoadingSpinner />}
            {!isLoading && steps[step].content}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default function App() {
  return <AppContent />;
}
