import { useState, useEffect } from 'react';
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
import Footer from './components/layout/Footer';
import TermsAndConditions from './steps/TermsAndConditions';
import { stepsConfig } from './config/step';
import { Company, Individual } from './types';

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
    const companyEditStep = steps.find((step) => step.key === 'company_edit');

    if (companyEditStep) {
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

  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

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

  const handleIndividual = (values: Omit<Individual, 'id' | 'checks'>) => {
    if (individualIndex !== null) {
      individuals[individualIndex] = values;
    } else {
      individuals.push(values);
    }

    const individualEditStep = steps.find(
      (step) => step.key === 'individual_edit'
    );
    if (individualEditStep) {
      setIndividualIndex(0);
      if (step === steps.length - 1) {
        submit();
      } else {
        next();
      }
    }
  };

  useEffect(() => {
    // Submit onboarding when last step
    if (!caseId && step === steps.length - 1) {
      submit();
    }
  }, [metadata]);

  const handleMetadata = (values: any) => {
    setMetadata({
      ...metadata,
      ...values,
    });
  };

  // @Deprecated
  const changeHandlerMetadata = (e: any) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  // @Deprecated
  const changeHandlerMetadataCustom = (question: string, answer: string) => {
    setMetadata({ ...metadata, [question]: answer });
  };

  let steps: any[] = [];

  if (!caseId) {
    steps = stepsConfig.map((step, index) => {
      if (step.key === 'company_search') {
        return {
          ...step,
          content: (
            <CompanySearch
              company={company}
              isLoading={isLoading}
              onChange={handleCompany}
              next={next}
            />
          ),
        };
      }
      if (step.key === 'company_list') {
        return {
          ...step,
          content: (
            <CompaniesList
              company={company}
              setCompany={setCompany}
              selectCompany={selectCompany}
              back={back}
            />
          ),
        };
      }
      if (step.key === 'company_edit') {
        return {
          ...step,
          content: (
            <CompanyEdit
              company={company}
              onChange={handleCompany}
              next={index !== stepsConfig.length - 1 ? next : null}
            />
          ),
        };
      }
      if (step.key === 'individuals_list') {
        return {
          ...step,
          content: (
            <IndividualsList
              setIndividualIndex={setIndividualIndex}
              individuals={individuals}
              setIndividuals={setIndividuals}
              handleIndividual={handleIndividual}
              hasApplicant={step.hasApplicant ?? true}
              submit={index === stepsConfig.length - 1 ? submit : next}
            />
          ),
        };
      }
      if (step.key === 'individual_edit') {
        return {
          ...step,
          content: (
            <IndividualEdit
              individual={individuals[0] || {}}
              onChange={handleIndividual}
            />
          ),
        };
      }
      if (step.key === 'terms_and_conditions') {
        return {
          ...step,
          content: (
            <TermsAndConditions
              metadata={metadata}
              onChange={handleMetadata}
              next={index !== stepsConfig.length - 1 ? next : null}
            />
          ),
        };
      }

      return {
        ...step,
        content: (
          <CustomForm
            stepId={step.key}
            fields={step.fields ?? []}
            metadata={metadata}
            changeHandlerMetadata={changeHandlerMetadata}
            changeHandlerMetadataCustom={changeHandlerMetadataCustom}
            next={index !== stepsConfig.length - 1 ? next : null}
          />
        ),
      };
    });
  }

  if (caseId) {
    steps.push({
      key: 'checks_list',
      content: <ChecksList caseId={caseId} />,
    });
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }} minH="100vh">
      {isMobile ? <MobileHeader /> : <Sidebar />}
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
