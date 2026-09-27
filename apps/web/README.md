# Next.js Power Paint

## What is it?

> [Next.js](https://nextjs.org) project with an online paint application built using the Canvas API, WebSockets and Server Rendering.

## What features does it have?

- Real-time collaborative painting: Multiple users can paint on the same canvas simultaneously, and their changes will be reflected in real-time for all users.
- User authentication: Users can sign up and log in to the application via OAuth2 providers or email.
- Multiple brush types and colors: Users can choose from a variety of brush types and colors to create their artwork.
- Save and load paintings: Users can save their paintings to the server and load them later to continue working on them or share with others.
- Theme support: Users can switch between light and dark themes for a better painting experience.
- Internationalization: The application supports multiple languages to cater to a global audience.

## What about TODOs? 

- [ ] Board image element
- [ ] AI image processing
- [ ] Grid pivot points
- [ ] Connectors

## How to run it?

### 1. Install the dependencies:

```bash
yarn install
```

### 2. Configure the environment variables:

```bash
cp .env.example .env
```

And then edit the `.env` file to set your environment variables.

### 3. Generate prisma types:

```bash
yarn prisma:generate
```

### 4. Run the development server:

```bash
yarn dev
```

> TIP: Make sure that you've already started other services

### 5. Build the application for production and start the server:

```bash
yarn build
yarn start
```

## Do not forget about tests! 

You can run unit and integration tests using this command:

```bash
yarn test
```
