# SignStack Embed — Angular Sample

A standalone Angular 21 sample for the SignStack web components, with a small Node backend included under [`backend/`](./backend).

Components demoed:

- **`signstack-builder`** — editor for SignStack resources (blueprint, template, schema, asset, function)
- **`signstack-workflow`** — workflow embed (editor or monitor, picked automatically)
- **`signstack-participant`** — embedded signing experience

## How it works

The backend mints a short-lived **embed token**, and the app mounts the SignStack component with it:

1. The app requests a token — `POST http://localhost:4000/api/embed-token`
2. The backend returns `{ "embedToken": "<jwt>" }`
3. The app mounts the component with that token

## 1. Start the backend

Run these from the project root — no need to `cd` into `backend/`:

```bash
npm run backend:install   # installs the backend deps
npm run backend           # http://localhost:4000
```

`SIGNSTACK_API_KEY` is required — keep it server-side only, never exposed to the browser.

## 2. Start the Angular app

```bash
npm install
npm start            # http://localhost:4300
```

Open http://localhost:4300, pick a tab (Builder / Workflow / Participant), fill in the fields, and click **Load**.

To point the app at a different backend URL, edit `BACKEND_URL` at the top of [src/app/embed-token.service.ts](./src/app/embed-token.service.ts).
