import { useState, useEffect } from 'react';
import { Stack, Flex, Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import CompanySearch from './steps/CompanySearch';
import CompaniesList from './steps/CompaniesList';
import CustomForm from './steps/CustomForm';
import CompanyEdit from './steps/CompanyEdit';
import IndividualEdit from './steps/IndividualEdit';
import IndividualsList from './steps/IndividualsList';
import ChecksList from './steps/ChecksList';
import useApi from './hooks/useApi';
import { form } from './config/Forms';

const AppContent = () => {
  const { t, i18n } = useTranslation();

  const api = useApi();

  const [searchParams] = useSearchParams();

  const [caseId, setCaseId] = useState(
    searchParams.get('new') === 'true'
      ? undefined
      : searchParams.get('caseId') || localStorage.getItem('caseId')
  );

  const email = searchParams.get('email');
  const sid = searchParams.get('sid');

  async function fetchMyAPI() {
    if (caseId)
      setStep(steps.findIndex((element) => element.key === 'checks_list'));

    const response = await api.get('/dotfile/countries');
    setCountries(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchMyAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [countries, setCountries] = useState([]);

  const [step, setStep] = useState(0);

  const [companies, setCompanies] = useState<any>([]);

  const [individuals, setIndividuals] = useState<any>([]);

  const [individual, setIndividual] = useState<any>({});

  const [metadata, setMetadata] = useState<any>({
    email,
    sid,
  });

  const [company, setCompany] = useState<any>({
    name: searchParams.get('company'),
    country: searchParams.get('country'),
    registration_number: searchParams.get('registrationNumber'),
  });

  const [individualIndex, setIndividualIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

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
    setCaseId(response.data.caseId);
    localStorage.setItem('caseId', response.data.caseId);
    setStep(steps.findIndex((element) => element.key === 'checks_list'));
    setIsLoading(false);
  };

  const back = async () => {
    setStep(step - 1);
  };

  const [autoSearchDone, setAutoSearchDone] = useState(false);

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

      if (response.data.data.length === 0) {
        setIsLoading(false);
        setStep(step + 2);
      } else {
        setIsLoading(false);
        setCompanies(response.data.data);
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectCompany = async (id: any) => {
    if (id === null) {
      setIndividuals([]);
      setStep(step + 1);
    } else {
      setIsLoading(true);
      const response = await api.get(`/dotfile/companies/${id}`);
      setCompany(response.data);
      setIndividuals(response.data.merged_individuals);
      setIsLoading(false);
      setStep(step + 1);
    }
  };

  const selectIndividual = (i: any) => {
    if (i === null) {
      setIndividual({});
      setIndividualIndex(null);
    } else {
      setIndividualIndex(i);
      setIndividual(individuals[i]);
    }
    setStep(steps.length - 2);
  };

  const changeHandler = (e: any) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const changeHandlerMetadata = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const changeHandlerMetadataCustom = (question: string, answer: string) => {
    setMetadata({ ...metadata, [question]: answer });
  };

  const [individualsValid, setIndividualsValid] = useState(true);

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

    setStep(step - 1);
  };

  const steps = [
    {
      key: 'company_search',
      content: (
        <CompanySearch
          getCompanies={getCompanies}
          countries={countries}
          company={company}
          changeHandler={changeHandler}
          isLoading={isLoading}
          autoSearchDone={autoSearchDone}
        />
      ),
    },
    {
      key: 'company_list',
      content: (
        <CompaniesList
          selectCompany={selectCompany}
          companies={companies}
          isLoading={isLoading}
          back={back}
        />
      ),
    },
    {
      key: 'company_edit',
      content: (
        <CompanyEdit
          company={company}
          changeHandler={changeHandler}
          next={next}
          back={back}
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
    },
    {
      key: 'individual_edit',
      content: (
        <IndividualEdit
          individual={individual}
          setIndividual={setIndividual}
          saveIndividual={saveIndividual}
          next={next}
          back={back}
          countries={countries}
          setIndividualsValid={setIndividualsValid}
        />
      ),
    },
    {
      key: 'checks_list',
      content: (
        <ChecksList
          individual={individual}
          setIndividual={setIndividual}
          saveIndividual={saveIndividual}
          next={next}
          back={back}
          countries={countries}
          caseId={caseId}
          setIsLoading={setIsLoading}
        />
      ),
    },
  ];

  form.forEach((item: any) => {
    const content = (
      <CustomForm
        stepId={item.key}
        fields={item.fields}
        metadata={metadata}
        changeHandlerMetadata={changeHandlerMetadata}
        changeHandlerMetadataCustom={changeHandlerMetadataCustom}
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
              progress={(step / (steps.length - 2)) * 100}
              hasBackButton={step !== 0 && step !== steps.length - 1}
            >
              {t(`steps.${steps[step].key}.title`)}
            </Header>
            {i18n.exists(`steps.${steps[step].key}.description`) && (
              <Text>{t(`steps.${steps[step].key}.description`)}</Text>
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
