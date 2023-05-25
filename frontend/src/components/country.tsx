import { useMemo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { COUNTRIES } from '../constants/all-iso31661-alpha2-codes.constant';

export type CountryProps = {
  /**
   * ISO 3166-1 alpha-2 country code
   * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
   */
  code: string;
  /**
   * Only default country flag instead of flag and name
   */
  flagOnly?: boolean;
} & BoxProps;

export const Country = ({
  code,
  flagOnly,
  ...rest
}: CountryProps): JSX.Element => {
  const children = useMemo(() => {
    const country = COUNTRIES.find((c) => c.value === code);
    if (!country) {
      console.error(`Could not find country from code '${code}'`);
      return '???';
    }

    if (flagOnly) {
      try {
        return country.label.split(' ')[0];
      } catch (error) {
        console.error(error);
        return '???';
      }
    }

    return country.label;
  }, [code, flagOnly]);

  return (
    <Box as="span" {...rest}>
      {children}
    </Box>
  );
};
