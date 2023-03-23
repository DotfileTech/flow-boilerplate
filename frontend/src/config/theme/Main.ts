import { extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const theme = extendTheme({
  colors: {
    brand: {
      'main-0': '#EDF6FE',
      'main-1': '#8BC8FC',
      'main-2': '#006BE4',
      'main-3': '#002776',
      sidebar: 'linear-gradient(134.97deg, #075ED2 -9.42%, #007FFB 84.86%)',
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
  },
  breakpoints: {
    md: '60em',
  },
  styles: {
    global: {
      body: {},
      a: {
        color: 'teal.500',
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
          bg: 'brand.main-2',
        },
      },
    },
    Tabs: {
      baseStyle: {
        root: {},
        tab: {
          color: 'black',
          _selected: {
            color: 'brand.main-2',
          },
        },
        tablist: {
          //
        },
      },
    },
    Modal: {
      baseStyle: {
        header: {
          color: 'white',
          bg: 'brand.main-2',
        },
        tablist: {},
      },
    },
    Tag: {
      baseStyle: {
        container: {
          bg: 'brand.main-2',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: '4px',
      },
      sizes: {
        xl: {
          h: '56px',
          fontSize: 'lg',
          px: '32px',
        },
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: 'brand.main-2',
        }),
        back: (props: StyleFunctionProps) => ({}),
        next: (props: StyleFunctionProps) => ({
          bg: 'brand.main-2',
          color: 'white',
          maxWidth: '200px',
        }),
        upload: (props: StyleFunctionProps) => ({
          bg: 'brand.main-2',
          fontSize: 'xs',
          size: 'xs',
          color: 'white',
        }),
        select: (props: StyleFunctionProps) => ({
          boxShadow: '1px 1px 16px rgba(153, 153, 153, 0.1)',
          border: '1px solid #F9F9F9',
        }),
        fill: (props: StyleFunctionProps) => ({
          fontSize: 'sl',
          // maxWidth: '200px',
          border: '1px solid',
          borderColor: 'brand.secondary',
          color: 'brand.secondary',
          padding: '1rem',
        }),
        add_individual: (props: StyleFunctionProps) => ({
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
  },
})

export default theme
