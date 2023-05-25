import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HStack,
  Show,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useMediaQuery,
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
import { Case, CheckInterface, Company, Individual } from '../types';
import { TabButton } from '../components/tab-button';
import { CopyableText } from '../components/copyable-text';
import { CaseFlagEnum } from '../constants/case-flag.enum';
import { UnderReview } from '../components/UnderReview';

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
  const [tabIndex, setTabIndex] = useState<number>(0);

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

  const handleTabButtonChange = (index: number) => {
    setTabIndex(index);
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

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

  if (
    !hasCompaniesActions &&
    !hasIndividualsActions &&
    !caseData?.flags.includes(CaseFlagEnum.all_checks_approved)
  ) {
    return <UnderReview />;
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
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <HStack justifyContent="space-between">
          {hasKyb && (
            <TabList
              position="sticky"
              top="0"
              zIndex="1"
              display={{ base: 'flex', md: 'inline-flex' }}
              w={{ base: '100%', md: 'auto' }}
            >
              {hasCompanies && (
                <Tab color="gray.500">
                  {t('companies')}
                  {hasCompaniesActions && (
                    <Indicator ml="2" boxSize="8px" color="orange.500" />
                  )}
                </Tab>
              )}
              {hasIndividuals && (
                <Tab color="gray.500">
                  {t('individuals')}
                  {hasIndividualsActions && (
                    <Indicator ml="2" boxSize="8px" color="orange.500" />
                  )}
                </Tab>
              )}
            </TabList>
          )}
          <Show above="sm">
            <CopyableText
              label={t('steps.checks_list.copy.label')}
              value={`${process.env.REACT_APP_BASE_URL}?caseId=${caseId}`}
            />
          </Show>
        </HStack>

        <TabPanels>
          {hasCompanies && (
            <TabPanel p={{ base: '0', md: '4' }}>
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
              {hasIndividualsActions && (
                <TabButton
                  entityName="individuals"
                  tabIndex={1}
                  onClick={handleTabButtonChange}
                />
              )}
            </TabPanel>
          )}
          {hasIndividuals && (
            <TabPanel p={{ base: '0', md: '4' }}>
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
              {hasCompaniesActions && (
                <TabButton
                  entityName="company"
                  tabIndex={0}
                  onClick={handleTabButtonChange}
                />
              )}
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
