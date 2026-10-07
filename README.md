# Customer Review Intelligence Platform

## Run

```bash
npm install
npm run dev
```

## JWT configuration

Create `.env.local` in the project root:

```env
VITE_JWT_TOKEN=YOUR_JWT_TOKEN
```

The Settings page can override this token and stores the updated value in browser localStorage for subsequent requests. Do not include `Bearer` in the token value; the API service adds it automatically.

## Analysis modes

The Settings page controls two mutually exclusive modes:

- **Analysis using Agent ID** — user enters Agent ID, Input Value, and uploads the customer review file. This starts Agent Execution, reads `data.agentExecutionId`, then calls Execution History.
- **Analysis using Execution ID** — user enters an existing Execution ID and the app calls Execution History directly. No Agent Execution is performed.

First-load default: **Execution ID mode**.

Default Execution ID:

`b7250100-6121-4495-90d1-2c24bc9879e8`

## Centralized API configuration

API URLs live only in `src/config/apiConfig.js` and request functions live only in `src/services/apiService.js`.

The Agent ID is never hardcoded; it is entered by the user.

## Existing dashboard

`src/dashboard/Dashboard.jsx` is the existing Customer Review Intelligence dashboard and has been reused without changing its implementation.
