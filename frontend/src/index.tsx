import '@fontsource/poppins'

import { ColorModeScript } from '@chakra-ui/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
}

export const theme = extendTheme({
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        // bg: 'gray.100',
      },
      // styles for the `a`
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
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              // backgroundColor: mode("black", "black"),
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
            },
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          borderRadius: '1rem',
          bg: '#5B75FF',
        },
      },
    },
    Button: {
      // 1. We can update the base styles
      baseStyle: {
        fontWeight: 'bold', // Normally, it is "semibold"
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        xl: {
          h: '56px',
          fontSize: 'lg',
          px: '32px',
        },
      },
      // 3. We can add a new visual variant
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: '#5B75FF',
        }),
        back: (props: StyleFunctionProps) => ({}),
        next: (props: StyleFunctionProps) => ({
          bg: '#5B75FF',
          color: 'white',
          maxWidth: '200px',
        }),
        select: (props: StyleFunctionProps) => ({
          maxWidth: '400px',
          boxShadow: '1px 1px 16px rgba(153, 153, 153, 0.1)',
          border: '1px solid #F9F9F9',
        }),
        fill: (props: StyleFunctionProps) => ({
          fontSize: 'sl',
          maxWidth: '200px',
          border: '1px solid #333333',
          padding: '2px',
        }),
      },
      defaultProps: {
        size: 'lg', // default is md
        variant: 'sm', // default is solid
        colorScheme: 'blue', // default is gray
      },
    },
  },
})

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Router>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
