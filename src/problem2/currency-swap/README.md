# Currency Swap

A currency swap form built with **React 19 + TypeScript + Vite + MUI**. Pick a token to send, an amount, and a token to receive — the converted amount and exchange rate update live, backed by a mocked price API.

[View demo](https://drive.google.com/file/d/1WmGwPoNC2bR_yse1zdlH4xpuuOmL2nHz/view?usp=sharing)

## guide

```bash
npm install     # or: yarn install
npm run dev     # or: yarn dev — http://localhost:5173
```

Other scripts:

```bash
npm run build     # tsc -b && vite build — type-checks then builds to dist/
npm run test      # vitest run — unit tests for the form + token selector
npm run lint      # eslint .
npm run preview   # serve the production build locally
```

### technical

| File | What it does |
|---|---|
| [`src/components/SwapForm.tsx`](src/components/SwapForm.tsx) | Core logic: amount validation, live conversion, flip, mock submit with a loading state. |
| [`src/components/TokenSelect.tsx`](src/components/TokenSelect.tsx) | Currency dropdown with icon (falls back to an initials avatar if no icon matches). |
| [`src/datasources/priceApi.ts`](src/datasources/priceApi.ts) | The "mock API" — wraps the static `prices.json` snapshot in a delayed `Promise`, dedupes duplicate/stale entries, drops invalid prices. |
| [`src/utils/tokenIcons.ts`](src/utils/tokenIcons.ts) | Case-insensitive lookup from currency symbol → icon file, using `import.meta.glob`. |
| [`src/App.tsx`](src/App.tsx) | Wires theme (auto light/dark via `prefers-color-scheme`), the loading skeleton, and the form together. |
| `src/components/*.test.tsx` | Unit tests (React Testing Library + Vitest). |

**Notable decisions:**

- **Mock API, not a static computation.** `fetchTokenPrices()` returns a `Promise` with an artificial ~700ms delay so the loading skeleton (`SwapFormSkeleton.tsx`) has something real to show, and so the data-fetching shape matches what a real API call would look like.
- **Responsive layout**: amount/converted-amount fields stack vertically on narrow screens and sit side-by-side on wider ones.
- **Validation is form-only.** The mock price fetch always succeeds — errors shown are just amount validation (empty/zero/negative), not simulated network failures.

**Known limitations:**

- This is a front-end-only demo: "submitting" a swap just waits ~900ms and shows a success message — nothing is persisted.
- Prices are a static snapshot (`prices.json`), not live data.
