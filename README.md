This is a sample application to demonstrate how to build a KYB process using Dotfile API.

## backend

An Express application that act as a proxy between the frontend and Dotfile API to manage:

- Authentication with Dotfile API
- Wrap API calls to Dotfile API
- A basic set of KYB rules based on the role of the individuals

## frontend

A React application to manage a multi-step form to collect the information necessary to the KYB process:

- Search for a Company and edit its information
- Create Individuals
- Free from to collect additional information

More information in [frontend/readme.md](https://github.com/DotfileTech/flow-boilerplate/blob/main/frontend/src/config/README.md)

## deployment

The Application can be easily deployed to Render.com or Heroku.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/DotfileTech/flow-boilerplate)


## Env variable

- `NODE_ENV` Specify the node environment

### Dotfile Config

- `DOTFILE_KEY` API Key for the target Dotfile workspace
- `DOTFILE_BASE_URL` BASE URL for used Dotfile API environment
- `TEMPLATE_ID` Checks template to be used

### Email config

- `SMTP_HOST`
- `SMTP_PORT`
- `EMAIL_USER`
- `EMAIL_FROM`
- `EMAIL_PASSWORD`

### Other

- `APP_URL` Frontend URL
- `LOGO_URL` Static logo to be used in emails

## Webhooks

Create a Webhook pointing to the backend URL (`${REACT_APP_HOST}/webhooks/checks`)