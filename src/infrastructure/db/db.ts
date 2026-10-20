import Dexie, { type EntityTable } from 'dexie';

// Definisci un database Dexie per transazioni finanziarie.
// Ogni transazione ha: id (auto-increment), date (Date), description (string),
// amount (number, negativo per spese, positivo per entrate), category (string, default "Uncategorized"),
// importHash (string, unico, per evitare duplicati all'import).
// Crea un indice su date, category e importHash.

export const DEFAULT_CATEGORY = 'Uncategorized';

export interface Transaction {
  id: number;
  date: Date;
  description: string;
  /** Negativo per spese, positivo per entrate. */
  amount: number;
  category: string;
  /** Hash univoco del record d'origine: impedisce duplicati all'import. */
  importHash: string;
}

/** Transazione in fase di creazione: `id` è assegnato dal DB. */
export type NewTransaction = Omit<Transaction, 'id'> & { id?: number };

export class SpesarioDatabase extends Dexie {
  transactions!: EntityTable<Transaction, 'id'>;

  constructor() {
    super('spesario');

    this.version(1).stores({
      // `id` è la primary key auto-increment.
      // `&importHash` = indice unico, `date` e `category` = indici non unici.
      transactions: '++id, date, category, &importHash',
    });

    this.transactions = this.table('transactions');
  }
}

export const db = new SpesarioDatabase();

/** Crea una transazione applicando i default (categoria, id auto-increment). */
export function createTransaction(
  input: Omit<NewTransaction, 'category'> & { category?: string },
): NewTransaction {
  return {
    ...input,
    category: input.category?.trim() || DEFAULT_CATEGORY,
  };
}
