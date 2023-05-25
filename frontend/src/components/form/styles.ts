import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Container = styled(Box)`
  .react-tel-input {
    max-width: 400px;
  }

  *:focus:not([data-focus-visible-added]) {
    box-shadow: 0 0 0 1px #3182ce;
  }
  .input,
  .button {
    font-size: var(--chakra-fontSizes-md);
    border-radius: var(--chakra-radii-md);
  }
  .input {
    width: 100%;
    border-color: var(--chakra-colors-gray-200);
    box-sizing: border-box !important;
    height: var(--chakra-sizes-10);
    transition-property: var(--chakra-transition-property-common);
    transition-duration: var(--chakra-transition-duration-normal);
    &:hover {
      border-color: var(--chakra-colors-gray-300);
    }
    &:focus,
    &:focus-visible,
    &:active {
      border: solid 1px #3182ce;
      border-radius: var(--chakra-radii-md);
    }
  }
  .button {
    border-radius: var(--chakra-radii-md) 0 0 var(--chakra-radii-md);
    top: 1px;
    bottom: 1px;
    left: 1px;
    border: 0px;
    .selected-flag {
      border-radius: var(--chakra-radii-md) 0 0 var(--chakra-radii-md);
      background-color: var(--chakra-colors-gray-200);
    }
    .dropDown.country-list {
      position: relative;
      border-radius: var(--chakra-radii-md);
      border-color: var(--chakra-colors-gray-300);
      padding: var(--chakra-space-1);
      margin-bottom: var(--chakra-space-4);
    }
    .country:hover,
    .highlight {
      border-radius: var(--chakra-radii-md);
    }

    &.open,
    &:hover {
      border-radius: var(--chakra-radii-md) 0 0 var(--chakra-radii-md);
      .selected-flag {
        background-color: var(--chakra-colors-gray-200);
        border-radius: var(--chakra-radii-md) 0 0 var(--chakra-radii-md);
      }
    }
  }
`;
