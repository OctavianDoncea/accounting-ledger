export type AccountType = 'ASSET' | 'LIABILTY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type Direction = 'DEBIT' | 'CREDIT'

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
}

export interface LedgerEntry {
    id: string;
    account_id: string;
    account_name: string;
    amount: number;
    direction: Direction;
}

export interface Transaction {
    id: string;
    description: string;
    posted_at: string;
    entries: LedgerEntry[];
}

export interface CreateTransactinPayload{
    description: string;
    entries: {
        account_id: string;
        amount: number;
        direction: Direction;
    }[];
}