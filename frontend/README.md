## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br /> Open
[http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.<br /> You will also see any lint errors
in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br /> See the section
about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br /> It correctly bundles
React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br /> Your app is
ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

## Query params

You can add several query params in the url to set a specific config or pre-filled input.

- `new`: Use `true` value to launch a new onboarding flow
- `caseId`: Use and ID value from dotfile to redirect user to the checks section
- `email`: To define the applicant of the onboarding flow (this is the contact for the recollection email)
- `sid`: ?
- `company`: To pre-fill the company name
- `country`: To pre-fill the country (country code 2 char)
- `registrationNumber`: To pre-fill the registration number of the company
- `externalId`: ?
- `lng`: To override the language if needed