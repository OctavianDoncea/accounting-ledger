import axios from 'axios';
import type { Account, Transaction, CreateTransactionPayload } from '../types';

const api = axios.create({baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',});

export const getAccounts = () =>
    api.get<Account[]>('/accounts/').then(r => r.data);

export const createAccount = (data: { name: string; type: string }) =>
    api.post<Account>('/accounts/', data).then(r => r.data);

export const getLedger = (skip = 0, limit = 50) =>
    api.get<Transaction[]>(`/ledger/?skip=${skip}&limit=${limit}`).then(r => r.data);

export const createTransaction = (data: CreateTransactionPayload) =>
    api.post<Transaction>('/transaction/', data).then(r => r.data)