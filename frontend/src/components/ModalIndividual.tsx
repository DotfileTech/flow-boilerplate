import { useMemo } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Modal,
  Text,
  Stack,
  Button,
  ModalFooter,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { Individual } from '../types';
import { IndividualRoleEnum } from '../constants';
import { IndividualEditFormValues } from '../steps/utils';
import { individualSchema } from '../steps/validation/individual.schema';
import IndividualForm from './IndividualForm';

type ModalIndividualProps = {
  selectedIndividual: Omit<Individual, 'id' | 'checks'> | null;
  onChange: (values: Omit<Individual, 'id' | 'checks'>) => void;
  onClose: () => void;
  validIndividuals: () => void;
};

const ModalIndividual = (props: ModalIndividualProps) => {
  const { selectedIndividual, onChange, onClose, validIndividuals } = props;
  const { t, i18n } = useTranslation();

  const defaultValues = useMemo(() => {
    const defaultValues: IndividualEditFormValues = {
      first_name: selectedIndividual?.first_name || '',
      middle_name: selectedIndividual?.middle_name || '',
      last_name: selectedIndividual?.last_name || '',
      maiden_name: selectedIndividual?.maiden_name || '',
      email: selectedIndividual?.email || '',
      roles: selectedIndividual?.roles || [],
      birth_date: selectedIndividual?.birth_date || '',
      birth_country: selectedIndividual?.birth_country || '',
      birth_place: selectedIndividual?.birth_place || '',
      address: {
        street_address: selectedIndividual?.address?.street_address || '',
        street_address_2: selectedIndividual?.address?.street_address_2 || '',
        postal_code: selectedIndividual?.address?.postal_code || '',
        city: selectedIndividual?.address?.city || '',
        country: selectedIndividual?.address?.country || '',
      },
      banking_information: {
        iban: selectedIndividual?.banking_information?.iban || '',
        bic: selectedIndividual?.banking_information?.bic || '',
      },
      tax_identification_number:
        selectedIndividual?.tax_identification_number || '',
      social_security_number: selectedIndividual?.social_security_number || '',
      phone_number: selectedIndividual?.phone_number || '',
      position: selectedIndividual?.position || '',
      ownership_percentage: selectedIndividual?.ownership_percentage || null,
    };

    return defaultValues;
  }, [selectedIndividual]);

  const methods = useForm<IndividualEditFormValues>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(individualSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting, isDirty },
  } = methods;

  const onSubmit: SubmitHandler<IndividualEditFormValues> = async (
    formData
  ) => {
    onChange(formData);
    validIndividuals();
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      size={['full', 'md']}
      onClose={() => {
        onClose();
      }}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('steps.individual_edit.title')}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody m="0" p="6">
          {i18n.exists(`steps.individual_edit.description`) && (
            <Text
              mt="5"
              dangerouslySetInnerHTML={{
                __html: t('steps.individual_edit.description'),
              }}
            ></Text>
          )}
          <FormProvider {...methods}>
            <VStack
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing="6"
              alignItems="start"
            >
              <IndividualForm
                isApplicant={
                  selectedIndividual?.roles?.includes(
                    IndividualRoleEnum.applicant
                  ) || false
                }
              />
            </VStack>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Stack direction={['column-reverse', 'row']} spacing={4}>
            <Button variant="outline" onClick={onClose}>
              {t('domain.form.cancel')}
            </Button>
            <Button
              variant="solid"
              isLoading={isSubmitting}
              isDisabled={!isValid || !isDirty}
              onClick={handleSubmit(onSubmit)}
              type="submit"
            >
              {t('domain.form.save')}
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalIndividual;
