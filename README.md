# Introduction

This is a sample application to demonstrate how to build a KYB process using Dotfile API.

# Project Organization

## backend

An Express application that act as a proxy between the frontend and Dotfile API to manage:

- Authentication with Dotfile API
- Wrap API calls to Dotfile API
- A basic set of KYB rules based on the role of the individuals

## frontend

A React application to manage a multi-step form to collect the information necessary to the KYB process:

- Search for a Company and edit information
- Create Individuals
- Free from to collect additional information

# Deployment

The Application can be easily deployed to Render.com or Heroku.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://gitlab.com/romain.minaud2/dotfile-demozone)

