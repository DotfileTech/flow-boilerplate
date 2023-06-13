import { extendTheme } from '@chakra-ui/react';
import { defineStyle } from '@chakra-ui/styled-system';

// @TODO - OF-11 - Refactor style config file

const disabledStyles = {
  backgroundColor: 'gray.100',
  borderColor: 'gray.100',
  color: 'gray.500',
};

const theme = extendTheme({
  colors: {
    brand: {
      'main-0': '#23272F',
      'main-1': '#23272F',
      'main-2': '#23272F',
      'main-3': '#23272F',
      accent: '#0176FF',
      sidebarBg: '#23272F',
      sidebarColor: '#FFFFFF',
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
  },
  styles: {
    global: {
      body: {
        backgroundColor: 'white',
      },
      a: {
        color: 'brand.accent',
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
          bg: 'brand.accent',
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          _selected: {
            color: 'black',
            borderColor: 'brand.accent',
            borderBottomColor: 'brand.accent',
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
          bg: 'brand.main-2',
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
          bg: 'brand.main-2',
          color: 'white',
          _hover: {
            bg: 'brand.main-2',
            _disabled: {
              bgColor: 'brand.main-2',
            },
          },
          _active: { bg: 'brand.main-2' },
        }),
        outline: () => ({
          border: '1px solid',
          borderColor: 'brand.main-2',
          bg: 'transparent',
          color: 'brand.main-2',
        }),
        ghost: () => ({
          px: 0,
          _hover: {
            bg: 'transparent',
          },
        }),
        back: () => ({}),
        next: () => ({
          bg: 'brand.main-2',
          color: 'white',
          _disabled: {
            ...disabledStyles,
            _hover: {
              ...disabledStyles,
            },
          },
        }),
        upload: () => ({
          bg: 'brand.main-2',
          fontSize: 'xs',
          size: 'xs',
          color: 'white',
        }),
        select: () => ({
          boxShadow: '1px 1px 16px rgba(153, 153, 153, 0.1)',
          border: '1px solid #F9F9F9',
        }),
        fill: () => ({
          fontSize: 'sl',
          // maxWidth: '200px',
          border: '1px solid',
          borderColor: 'brand.secondary',
          color: 'brand.secondary',
          padding: '1rem',
        }),
        add_individual: () => ({
          fontSize: 'sl',
          padding: '1rem',
        }),
      },
      // defaultProps: {
      //   // size: 'lg', // default is md
      //   // variant: 'sm', // default is solid
      //   // colorScheme: 'blue', // default is gray
      // },
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
      },
    },
  },
});

export default theme;
