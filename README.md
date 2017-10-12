# CryptoCurrencyReporter

Begining of a progressive web app meant to stream pricing data of BitCoin and Etherium crypto currencies. Built using Angular 4 and progressive web app frameworks.

The eventual plan will be to move streaming functionality to azure functions, issue native device push notifications based on dramatic price drops or gains, and display pricing data via D3js.

## Development

This app was built with angular-cli. Simply clone the repo, run `npm install`, then run `ng serve` for a dev server and navigate to `http://localhost:4200/`.

## Build

To build with service workers, run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
