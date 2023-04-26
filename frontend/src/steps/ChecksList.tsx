import { useState, useEffect, useMemo } from 'react';
import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import UploadDocuments from '../components/UploadDocuments';
import CheckCard from '../components/CheckCard';
import { CheckStatusEnum, CheckTypeEnum } from '../constants';
import { Indicator } from '../components/indicator';
import { hasKyb } from '../config/step';

const ChecksList = (props: any) => {
  const { t } = useTranslation();
  const api = useApi();
  const [isMobile] = useMediaQuery('(max-width: 48em)');

  async function fetchMyAPI() {
    const response = await api.get(`/dotfile/cases/${props.caseId}`);
    setData(response.data);
  }

  useEffect(() => {
    props.setIsLoading(true);
    fetchMyAPI();
    props.setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processIdentityCheck = async (check: any) => {
    const response = await api.post(`dotfile/checks`, {
      checkId: check.id,
      type: check.type,
    });
    window.open(response.data.url, '_blank', 'noreferrer');
  };

  const [data, setData] = useState<any>();

  const [isUpload, setIsUpload] = useState(false);

  const [currentCheck, setCurrentCheck] = useState({});
  const [currentIndividual, setCurrentIndividual] = useState({});

  const selectCheck = (check: any) => {
    if (check.type === CheckTypeEnum.id_verification) {
      processIdentityCheck(check);
    } else {
      setCurrentCheck(check);
      setIsUpload(true);
    }
  };

  const companies = useMemo(
    () => data?.companies.filter((company: any) => company.checks.length > 0),
    [data?.companies]
  );
  const hasCompaniesActions = useMemo(
    () =>
      (companies
        ?.flatMap((company: any) => company.checks)
        .filter((check: any) =>
          [CheckStatusEnum.in_progress, CheckStatusEnum.rejected].includes(
            check.status
          )
        ).length ?? 0) > 0,
    [companies]
  );

  const individuals = useMemo(
    () =>
      data?.individuals.filter(
        (individual: any) => individual.checks.length > 0
      ),
    [data?.individuals]
  );
  const hasIndividualsActions = useMemo(
    () =>
      (individuals
        ?.flatMap((individual: any) => individual.checks)
        .filter((check: any) =>
          [CheckStatusEnum.in_progress, CheckStatusEnum.rejected].includes(
            check.status
          )
        ).length ?? 0) > 0,
    [individuals]
  );

  const hasCompanies = (companies?.length ?? 0) > 0;
  const hasIndividuals = (individuals?.length ?? 0) > 0;

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
                {data.companies.map((item: any, i: number) => (
                  <CheckCard
                    key={i}
                    item={item}
                    type="company"
                    selectCheck={selectCheck}
                    setCurrentIndividual={setCurrentIndividual}
                  />
                ))}
              </Stack>
            </TabPanel>
          )}
          {hasIndividuals && (
            <TabPanel>
              <Stack spacing={5} pt={2}>
                {data.individuals.map((item: any, i: number) => (
                  <CheckCard
                    key={i}
                    item={item}
                    type="individual"
                    selectCheck={selectCheck}
                    setCurrentIndividual={setCurrentIndividual}
                  />
                ))}
              </Stack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      <UploadDocuments
        currentCheck={currentCheck}
        currentIndividual={currentIndividual}
        setIsUpload={setIsUpload}
        fetchMyAPI={fetchMyAPI}
        isUpload={isUpload}
      />
    </Stack>
  );
};

export default ChecksList;
