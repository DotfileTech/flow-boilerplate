import { FC, ReactNode } from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Badge,
} from '@chakra-ui/react';

export type GroupControlProps = FormControlProps & {
  error?: string | null;
  isRequired?: boolean;
  label?: string;
  labelFor?: string;
  labelPosition?: 'top' | 'right';
  labelOptionalBadge?: boolean;
  helper?: string;
  children?: ReactNode;
};

export const GroupControl: FC<GroupControlProps> = (props) => {
  const {
    error,
    isRequired = false,
    label,
    labelFor,
    labelPosition = 'top',
    labelOptionalBadge = false,
    helper,
    children,
    ...formControlProps
  } = props;

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!error}
      {...formControlProps}
    >
      {label && labelPosition === 'top' && (
        <FormLabel htmlFor={labelFor} mb={helper ? '0' : '2'}>
          {label} {labelOptionalBadge && <Badge size="xs">Optional</Badge>}
        </FormLabel>
      )}
      {helper && (
        <FormHelperText
          mb="2"
          mt={label && labelPosition === 'right' ? '-1' : '1'}
        >
          {helper}
        </FormHelperText>
      )}
      {label && labelPosition === 'right' ? (
        <HStack spacing={3}>
          {children}
          <FormLabel htmlFor={labelFor}>{label}</FormLabel>
        </HStack>
      ) : (
        children
      )}
      {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
