import { useState, useEffect } from 'react';
import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useApi from '../hooks/useApi';
import UploadDocuments from '../components/UploadDocuments';
import CheckCard from '../components/CheckCard';
import { CheckStatusEnum, CheckTypeEnum } from '../constants'

const ChecksList = (props: any) => {
  const { t } = useTranslation();
  const api = useApi();

  async function fetchMyAPI() {
    const response = await api.get(`/dotfile/cases/${props.caseId}`);
    setData(response.data);
    countRemainingChecks(response.data);
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

  const [data, setData] = useState({
    individuals: [],
    companies: [{ checks: [] }],
  });

  const [checksCompanies, setChecksCompanies] = useState(0);

  const [checksIndividuals, setChecksIndividuals] = useState(0);

  const [remainingChecksCompanies, setRemainingChecksCompanies] =
    useState(0);

  const [remainingChecksIndividuals, setRemainingChecksIndividuals] =
    useState(0);

  const [isUpload, setIsUpload] = useState(false);

  const [currentCheck, setCurrentCheck] = useState({});
  const [currentIndividual, setCurrentIndividual] = useState({});

  const selectCheck = (check: any) => {
    if (check.type === CheckTypeEnum.id_verification) {
      processIdentityCheck(check);
      // setIsSendEmail(true)
    } else {
      setCurrentCheck(check);
      setIsUpload(true);
    }
  }

  const countRemainingChecks = (data: any) => {
    let checksCompanies: any[] = [];
    let checksIndividuals: any[] = [];

    data.companies.map((item: any) =>
      item.checks
        .filter((check: any) => check.type !== CheckTypeEnum.aml)
        .forEach((element: any) => checksCompanies.push(element)),
    );

    data.individuals.map((item: any) =>
      item.checks
        .filter((check: any) => check.type !== CheckTypeEnum.aml)
        .forEach((element: any) => checksIndividuals.push(element)),
    );

    setRemainingChecksCompanies(
      checksCompanies.filter((check: any) => check.status === CheckStatusEnum.in_progress).length,
    );

    setRemainingChecksIndividuals(
      checksIndividuals.filter((check: any) => check.status === CheckStatusEnum.in_progress).length,
    );

    setChecksCompanies(checksCompanies.length);
    setChecksIndividuals(checksIndividuals.length);
  };

  return (
    <Stack spacing={5} pt={2}>
      <Tabs>
        <TabList>
          {checksCompanies > 0 && (
            <Tab>
              {t('companies')}
              <Badge variant="subtle" ml={5}>
                {remainingChecksCompanies}
              </Badge>
            </Tab>
          )}
          {checksIndividuals > 0 && (
            <Tab>
              {t('individuals')}{' '}
              <Badge variant="subtle" ml={5}>
                {remainingChecksIndividuals}
              </Badge>
            </Tab>
          )}
        </TabList>

        <TabPanels>
          {checksCompanies > 0 && (
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
          {checksIndividuals > 0 && (
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
