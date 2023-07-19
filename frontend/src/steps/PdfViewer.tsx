import { useMemo, useEffect } from 'react';
import {
  Button,
  VStack,
  Box,
  Checkbox as ChakraCheckbox,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { GroupController } from '../components/form/group-controller';

type PdfViewerProps = {
  stepId: string;
  pdfUrl: string;
  metadata: { [key: string]: string | boolean | null };
  onChange: (values: any) => void;
  next: () => void;
};

const PdfViewer = (props: PdfViewerProps) => {
  const { stepId, pdfUrl, metadata, onChange, next } = props;

  const { t } = useTranslation();

  const fieldId = useMemo(() => {
    return t(`steps.${stepId}.id`);
  }, [stepId]);

  const defaultValues = useMemo(() => {
    return {
      [fieldId]:
        metadata[fieldId] && typeof metadata[fieldId] == 'boolean'
          ? (metadata[fieldId] as boolean)
          : false,
    };
  }, [stepId]);

  const validationSchema = Yup.object({
    [fieldId]: Yup.boolean().oneOf([true], 'You must accept to continue'),
  });

  const methods = useForm({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [stepId, defaultValues]);

  const onSubmit: SubmitHandler<any> = async (formData) => {
    onChange({ [fieldId]: formData[fieldId] });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="6" alignItems="start">
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="500px"
        >
          <p>
            Unable to display PDF file. <a href={pdfUrl}>Download</a> instead.
          </p>
        </object>
        <GroupController
          name={fieldId}
          isRequired={true}
          control={control}
          render={(f) => {
            return (
              <ChakraCheckbox
                isChecked={f.value}
                onChange={(e: any) => {
                  setValue(fieldId, e.target.checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                {t(`steps.${stepId}.label`)}
              </ChakraCheckbox>
            );
          }}
        />

        <Box>
          <Button variant="next" isDisabled={!isValid} type="submit">
            {t('domain.form.next')}
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default PdfViewer;
