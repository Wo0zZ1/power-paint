# Next.js Power Paint

## What is it?

> Simple [Next.js](https://nextjs.org) project with an online paint application built using the Canvas API, WebSockets and Server Rendering.

## What features does it have (soon)?

- [ ] Real-time collaborative painting: Multiple users can paint on the same canvas simultaneously, and their changes will be reflected in real-time for all users.
- [ ] User authentication: Users can sign up and log in to the application by OAuth2 providers or by email.
- [ ] Multiple brush types and colors: Users can choose from a variety of brush types and colors to create their artwork.
- [ ] Save and load paintings: Users can save their paintings to the server and load them later to continue working on them or share with others.
- [x] ~~_Theme support: Users can switch between light and dark themes for a better painting experience._~~
- [x] ~~_Internationalization (i18n): The application supports multiple languages to cater to a global audience._~~

## How to run it?

### 1. Install the dependencies:

```bash
npm install
# or
yarn install
```

### 2. Configure the environment variables:

```bash
cp .env.example .env
```

And then edit the `.env` file to set your environment variables.

### 3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

### 4. Build the application for production and start the server:

```bash
npm run build
npm start
# or
yarn build
yarn start
```
