# Contesto Progetto: [Nome App] - PWA Local-First per Finanze Personali

## Stack
- Next.js 16 (App Router, Turbopack di default) + TypeScript
- Tailwind CSS per lo styling
- Dexie.js (IndexedDB) per la persistenza locale. NIENTE backend obbligatorio.
- PapaParse per il parsing dei CSV.

## Architettura
- `src/domain/` → logica pura (categorizzazione, calcoli). Nessun side effect, testabile.
- `src/infrastructure/db/` → schema Dexie e query.
- `src/components/` → UI. Preferisci Server Components dove possibile, Client Components per l'interattività locale.
- La logica di business (es. "questa transazione è una spesa fissa?") deve stare nel dominio, NON nei componenti React.

## Convenzioni
- Usa `async/await` e gestione esplicita degli errori. Niente `any`.
- Le funzioni di accesso al DB devono essere in moduli dedicati e tipizzate.
- Per i test, usa Vitest. Scrivi test per la logica in `domain/` prima di tutto.

## Regole per te (Copilot)
- Se ti chiedo un componente che legge dati, chiediti prima se può essere un Server Component o se serve `useLiveQuery` di Dexie.
- Non generare codice che chiami API remote se non ti dico esplicitamente che stiamo aggiungendo la sync opzionale.
- I dati delle transazioni vivono SOLO in IndexedDB: non esiste una route API `/api/transactions` da chiamare.

## Esempio canonico: transazioni del mese corrente

```tsx
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/src/infrastructure/db/db";

const transactions = useLiveQuery(() => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return db.transactions
    .where("date")
    .between(start, end, true, false)
    .toArray();
});
```

`useLiveQuery` va usato in un Client Component; per filtri/aggregazioni riusa le funzioni di `src/domain/` invece di ricalcolare inline.
