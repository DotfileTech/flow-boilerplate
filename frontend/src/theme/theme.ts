import { extendTheme, DeepPartial } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme';
import { defineStyle } from '@chakra-ui/styled-system';
import { colors } from './colors';
import { fonts } from '../config/theme/fonts';

const extensions: DeepPartial<ChakraTheme> = {
  colors,
  fonts,
  styles: {
    global: {
      body: {
        backgroundColor: 'white',
      },
      a: {
        fontWeight: 'bold',
        color: 'link.color',
        _hover: {
          textDecoration: 'underline',
        },
      },
      html: {},
    },
  },
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          borderRadius: '1rem',
          bg: 'brand.secondary',
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          _selected: {
            color: 'black',
            borderColor: 'brand.secondary',
            borderBottomColor: 'brand.secondary',
            borderBottomWidth: '2px',
            mb: '-2px',
          },
        },
        tablist: {
          borderBottom: '2x solid',
          borderColor: 'gray.200',
          backgroundColor: 'transparent',
        },
      },
    },
    Modal: {
      baseStyle: {
        header: {
          color: 'white',
          bg: 'brand.primary',
          textAlign: 'center',
          fontWeight: '500',
          padding: 4,
          borderTopRadius: 'md',
        },
        footer: {
          borderTop: '1px solid',
          borderColor: 'gray.200',
          justifyContent: 'center',
        },
        closeButton: {
          top: 3,
          right: 4,
          color: 'gray.300',
        },
        body: {
          p: 'unset',
          m: 6,
        },
        dialog: {
          padding: 0,
        },
        overlay: {
          backdropFilter: 'blur(3px)',
        },
      },
    },
    Button: {
      baseStyle: {
        lineHeight: '1.5',
        borderRadius: 'base',
        fontWeight: 'medium',
        transitionProperty: 'common',
        transitionDuration: 'normal',
        _focusVisible: {
          boxShadow: 'outline',
        },
        _disabled: {
          opacity: 0.4,
          cursor: 'not-allowed',
          boxShadow: 'none',
        },
        _hover: {
          textDecoration: 'none',
          _disabled: {
            bg: 'initial',
          },
        },
      },
      sizes: {
        lg: defineStyle({
          fontSize: 'md',
          px: '8',
          py: '3',
        }),
        md: defineStyle({
          fontSize: 'md',
          px: '8',
          py: '2',
        }),
        sm: defineStyle({
          fontSize: 'sm',
          px: '4',
          py: '1',
        }),
        xs: defineStyle({
          fontSize: 'xs',
          px: '2',
          py: '1',
        }),
      },
      variants: {
        solid: () => ({
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.primary',
            _disabled: {
              bgColor: 'brand.primary',
            },
          },
          _active: { bg: 'brand.primary' },
        }),
        outline: () => ({
          border: '1px solid',
          borderColor: 'brand.primary',
          bg: 'transparent',
          color: 'brand.primary',
        }),
        ghost: () => ({
          px: 0,
          _hover: {
            bg: 'transparent',
          },
        }),
        back: () => ({}),
        next: () => ({
          bg: 'brand.primary',
          color: 'white',
          _disabled: {
            backgroundColor: 'gray.100',
            borderColor: 'gray.100',
            color: 'gray.500',
            _hover: {
              backgroundColor: 'gray.100',
              borderColor: 'gray.100',
              color: 'gray.500',
            },
          },
        }),
        upload: () => ({
          bg: 'brand.primary',
          fontSize: 'xs',
          size: 'xs',
          color: 'white',
        }),
        select: () => ({
          boxShadow: '1px 1px 16px rgba(153, 153, 153, 0.1)',
          border: '1px solid #ffffff',
        }),
        fill: () => ({
          fontSize: 'sl',
          border: '1px solid',
          borderColor: 'brand.primary',
          color: 'brand.primary',
          padding: '1rem',
        }),
        add_individual: () => ({
          fontSize: 'sl',
          padding: '1rem',
        }),
      },
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'md',
          borderWidth: '1px',
          borderColor: `blue.700`,
          background: `blue.100`,
        },
        title: { color: `blue.700` },
        description: { color: `blue.700` },
        icon: { color: `blue.700` },
      },
      variants: {
        toast_success: () => ({
          container: {
            borderWidth: '1px',
            borderColor: `green.700`,
            background: `green.100`,
          },
          title: { color: `green.700` },
          description: { color: `green.700` },
          icon: { color: `green.700` },
        }),
        toast_warning: () => ({
          container: {
            borderWidth: '1px',
            borderColor: `yellow.700`,
            background: `yellow.100`,
          },
          title: { color: `yellow.700` },
          description: { color: `yellow.700` },
          icon: { color: `yellow.700` },
        }),
      },
    },
  },
};

const theme = extendTheme(extensions);

export default theme;
