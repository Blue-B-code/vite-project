# React Blog — Vite + Firebase

A blog application built with **React 19** and **Vite**, styled with **Tailwind CSS**, and deployable to **Firebase Hosting**.

## Features

- **Auth**: register / login pages with an app-wide auth context (`AppContext`).
- **Posts**: create, view and update posts (`react-router` routes).
- **Layout**: shared app layout and home page.
- **CI**: GitHub Actions workflow that installs dependencies and builds the project on push/PR to `main`.

## Tech stack

- React 19, Vite, React Router 7
- Tailwind CSS 4
- Firebase Hosting (`firebase.json`, `.firebaserc`)
- GitHub Actions

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Deploy to Firebase Hosting (requires a Firebase project):

```bash
firebase login
firebase deploy
```

## License

MIT
