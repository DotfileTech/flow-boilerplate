import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import ModalDocument from '../components/ModalDocument';
import CheckCard from '../components/CheckCard';
import { CheckStatusEnum, CheckTypeEnum } from '../constants';
import { Indicator } from '../components/indicator';
import { hasKyb } from '../config/step';
import { EmptyState } from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotFound } from '../components/NotFound';
import { CheckInterface, Company, Individual, Case } from '../types';

type ChecksListProps = {
  caseId: string;
};

const ChecksList = (props: ChecksListProps) => {
  const { caseId } = props;

  const { t } = useTranslation();
  const api = useApi();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48em)');

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCheck, setCurrentCheck] = useState<CheckInterface | null>(null);
  const [currentEntity, setCurrentEntity] = useState<
    Company | Individual | null
  >(null);

  const fetchMyAPI = useCallback(async () => {
    try {
      const response = await api.get(`/dotfile/cases/${caseId}`);
      setCaseData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  }, [api, caseId]);

  useEffect(() => {
    setLoading(true);
    fetchMyAPI().catch(console.error);
  }, [fetchMyAPI]);

  const selectCheck = (check: CheckInterface) => {
    if (check.type !== CheckTypeEnum.id_verification) {
      setCurrentCheck(check);
      onClose();
    }
  };

  const companies = useMemo(
    () =>
      caseData?.companies.filter(
        (company: Company) => company.checks.length > 0
      ),
    [caseData?.companies]
  );
  const hasCompaniesActions = useMemo(
    () =>
      (companies
        ?.flatMap((company: Company) => company.checks)
        .filter((check: CheckInterface) =>
          [CheckStatusEnum.in_progress, CheckStatusEnum.rejected].includes(
            check.status
          )
        ).length ?? 0) > 0,
    [companies]
  );

  const individuals = useMemo(
    () =>
      caseData?.individuals.filter(
        (individual: Individual) => individual.checks.length > 0
      ),
    [caseData?.individuals]
  );
  const hasIndividualsActions = useMemo(
    () =>
      (individuals
        ?.flatMap((individual: Individual) => individual.checks)
        .filter((check: CheckInterface) =>
          [CheckStatusEnum.in_progress, CheckStatusEnum.rejected].includes(
            check.status
          )
        ).length ?? 0) > 0,
    [individuals]
  );

  const hasCompanies = (companies?.length ?? 0) > 0;
  const hasIndividuals = (individuals?.length ?? 0) > 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <NotFound />;
  }

  if (!hasCompanies && !hasIndividuals) {
    return <EmptyState />;
  }

  return (
    <Stack spacing={5} pt={2}>
      <Tabs
        mt="2"
        pb="8"
        // isLazy is necessary for accordion state, otherwise the accordion of the other tabs mount but
        // is not visible and defaultOpen state is lost
        // @see https://chakra-ui.com/docs/components/tabs/usage#lazily-mounting-tab-panels
        isLazy
        isFitted={isMobile}
      >
        {hasKyb && (
          <TabList
            borderBottom="1px"
            borderColor="gray.100"
            position="sticky"
            top="0"
            zIndex="1"
          >
            {hasCompanies && (
              <Tab mr={{ base: 0, md: 10 }}>
                {t('companies')}
                {hasCompaniesActions && (
                  <Indicator ml="2" boxSize="8px" color="orange" />
                )}
              </Tab>
            )}
            {hasIndividuals && (
              <Tab mr={{ base: 0, md: 10 }}>
                {t('individuals')}
                {hasIndividualsActions && (
                  <Indicator ml="2" boxSize="8px" color="orange" />
                )}
              </Tab>
            )}
          </TabList>
        )}

        <TabPanels>
          {hasCompanies && (
            <TabPanel>
              <Stack spacing={5} pt={2}>
                {caseData?.companies.map((entity: Company) => (
                  <CheckCard
                    key={entity.id}
                    entity={entity}
                    entityType="company"
                    selectCheck={selectCheck}
                    setCurrentEntity={setCurrentEntity}
                    onOpen={onOpen}
                  />
                ))}
              </Stack>
            </TabPanel>
          )}
          {hasIndividuals && (
            <TabPanel>
              <Stack spacing={5} pt={2}>
                {caseData?.individuals.map((entity: Individual) => (
                  <CheckCard
                    key={entity.id}
                    entity={entity}
                    entityType="individual"
                    selectCheck={selectCheck}
                    setCurrentEntity={setCurrentEntity}
                    onOpen={onOpen}
                  />
                ))}
              </Stack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      {isOpen && currentCheck && currentEntity && (
        <ModalDocument
          currentCheck={currentCheck}
          fetchMyAPI={fetchMyAPI}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </Stack>
  );
};

export default ChecksList;
