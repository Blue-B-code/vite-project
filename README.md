# React Blog — Frontend (Vite)

The **React frontend** of a full-stack blog application. It talks to the **[api-laravel](https://github.com/Blue-B-code/api-laravel)** backend (Laravel 12 API) and can also be deployed to **Firebase Hosting**.

Built with **React 19** + **Vite**, styled with **Tailwind CSS**.

## Features

- **Auth**: register / login pages with an app-wide auth context (`AppContext`).
- **Posts**: create, view, edit and list posts (`react-router` routes).
- **Comments & likes**: post comments and toggle likes on a post.
- **Backend**: consumes `/api/*` endpoints from [api-laravel](https://github.com/Blue-B-code/api-laravel) (login, register, posts CRUD, comments, likes).
- **CI**: GitHub Actions workflow that installs dependencies and builds the project on push/PR to `main`.

## Tech stack

- React 19, Vite, React Router 7
- Tailwind CSS 4
- Backend: Laravel 12 API ([api-laravel](https://github.com/Blue-B-code/api-laravel))
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
