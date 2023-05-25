import { useState, useEffect, ReactElement } from 'react';
import { Stack, Flex, useMediaQuery } from '@chakra-ui/react';
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
import { FormData, Company, Individual } from './types';
import Footer from './components/layout/Footer';

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isMobile] = useMediaQuery('(max-width: 48em)');

  const api = useApi();

  const email = searchParams.get('email');

  const [caseId, setCaseId] = useState<string | undefined | null>(
    searchParams.get('new') === 'true'
      ? undefined
      : searchParams.get('caseId') || localStorage.getItem('caseId')
  );
  const [step, setStep] = useState<number>(0);
  const [individuals, setIndividuals] = useState<any>([]);
  const [individual, setIndividual] = useState<any>({});
  const [metadata, setMetadata] = useState<{ [key: string]: string | null }>({
    email,
  });
  const [company, setCompany] = useState<any>();
  const [individualIndex, setIndividualIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchMyAPI() {
    const externalId = searchParams.get('externalId');
    if (externalId) {
      const response = await api.get(`/dotfile/cases?externalId=${externalId}`);

      if (response.data.id) {
        setCaseId(response.data.id);
        // checks_list step
        setStep(0);
      } else {
        setCaseId(null);
      }
    }

    if (caseId) {
      // checks_list step
      setStep(0);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  useEffect(() => {
    if (hasKyb) {
      const country = searchParams.get('country');
      let registrationNumber = searchParams.get('registrationNumber');

      // Only for FRENCH companies, transform the SIRET(14) to SIREN(9) and store it in the registrationNumber
      if (country === 'FR' && registrationNumber?.length === 14) {
        registrationNumber = registrationNumber.slice(0, -5);
      }

      setCompany({
        name: searchParams.get('company'),
        country,
        registration_number: registrationNumber,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Skip search company step when the registration number is set in query param
    if (
      steps[step].key === 'company_search' &&
      company &&
      company.registration_number &&
      company.country
    ) {
      next();
    }
  }, [company, step]);

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
    if (steps[step].key === 'company_edit') {
      setCompany({
        ...company,
        registration_number: null,
      });
    }
    setStep(step - 1);
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

  const handleCompany = (values: Omit<Company, 'id' | 'checks'>) => {
    setCompany({
      ...company,
      ...values,
    });
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

  const handleIndividual = (values: Omit<Individual, 'id' | 'checks'>) => {
    if (individualIndex !== null) {
      individuals[individualIndex] = values;
    } else {
      individuals.push(values);
    }

    if (hasKyb) {
      setStep(step - 1);
    } else {
      setIndividualIndex(0);
      setIndividual(individuals[0]);
      if (steps.length === step + 1) {
        submit();
      } else {
        setStep(step + 1);
      }
    }
  };

  const changeHandlerMetadata = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const changeHandlerMetadataCustom = (question: string, answer: string) => {
    setMetadata({ ...metadata, [question]: answer });
  };

  const steps: { key: string; content: ReactElement }[] = [];

  if (hasKyb && !caseId) {
    steps.push(
      {
        key: 'company_search',
        content: (
          <CompanySearch
            company={company}
            isLoading={isLoading}
            onChange={handleCompany}
            next={next}
          />
        ),
      },
      {
        key: 'company_list',
        content: (
          <CompaniesList
            company={company}
            setCompany={setCompany}
            selectCompany={selectCompany}
            back={back}
          />
        ),
      },
      {
        key: 'company_edit',
        content: (
          <CompanyEdit company={company} onChange={handleCompany} next={next} />
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
          />
        ),
      }
    );
  }

  if (hasKyc && !caseId) {
    steps.push({
      key: 'individual_edit',
      content: (
        <IndividualEdit individual={individual} onChange={handleIndividual} />
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    form.forEach((item: FormData) => {
      const content = (
        <CustomForm
          stepId={item.key}
          fields={item.fields}
          metadata={metadata}
          changeHandlerMetadata={changeHandlerMetadata}
          changeHandlerMetadataCustom={changeHandlerMetadataCustom}
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
    <Flex direction={{ base: 'column', md: 'row' }} minH="100vh">
      <MobileHeader />
      {!isMobile && <Sidebar />}
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
              description={
                i18n.exists(`steps.${steps[step].key}.description`)
                  ? `steps.${steps[step].key}.description`
                  : null
              }
            />
            {isLoading && <LoadingSpinner />}
            {!isLoading && steps[step].content}
          </Stack>
        </Stack>
      </Flex>
      {isMobile && <Footer caseId={caseId} />}
    </Flex>
  );
};

export default function App() {
  return <AppContent />;
}
