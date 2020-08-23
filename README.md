# SPA AUTHENTICATION DEMO

## About

This project is used to demonstrate authentication in SPA. Credit to "Changhui Xu" for the tutorial here https://codeburst.io/jwt-auth-in-asp-net-core-148fb72bed03

## Technologies use

API server: using .NET core and SQL server

SPA client: implemented using GatsbyJS

## How to run

1. Setup appsetting config

2. Run database update

   ```bash
       dotnet database update
   ```

3. In development mode (need to run both api server and gatsby development server)

   ```bash
       dotnet run
   ```

   ```bash
       cd ClientApp
       gatsby develop
   ```

4. In production, the api server serve the static site built by Gatsby direct to request

## DEMO IMAGE

![Demo](demo.gif)
