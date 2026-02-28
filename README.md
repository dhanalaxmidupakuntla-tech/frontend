# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

### AI Tutor (OpenAI)

The app contacts a backend endpoint at `/api/ai/chat` to power the AI tutor. If that service fails with a 500 error, the frontend will automatically fall back to calling OpenAI directly using a key stored in an environment variable.

To enable the client-side fallback you must create a `.env` file in the project root with:

```
VITE_OPENAI_API_KEY=<your_openai_api_key>
```

Make sure you never commit your API key to source control. The frontend uses `import.meta.env.VITE_OPENAI_API_KEY` to pick it up.


## Expanding the ESLint configuration

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
