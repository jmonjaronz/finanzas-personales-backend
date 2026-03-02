import api from './api';
import type { Account, Category, Person, Transaction, Transfer, TransactionChannel, DashboardSummary } from '../types';

export const dataService = {
    // Accounts
    getAccounts: async () => (await api.get<Account[]>('/accounts')).data,
    createAccount: async (data: Partial<Account>) => (await api.post<Account>('/accounts', data)).data,
    updateAccount: async (id: number, data: Partial<Account>) => (await api.put<Account>(`/accounts/${id}`, data)).data,
    deleteAccount: async (id: number) => (await api.delete(`/accounts/${id}`)).data,

    // Categories
    getCategories: async () => (await api.get<Category[]>('/categories')).data,
    createCategory: async (data: Partial<Category>) => (await api.post<Category>('/categories', data)).data,

    // People
    getPeople: async () => (await api.get<Person[]>('/people')).data,
    createPerson: async (data: Partial<Person>) => (await api.post<Person>('/people', data)).data,

    // Transaction Channels
    getChannels: async () => (await api.get<TransactionChannel[]>('/transaction-channels')).data,
    createChannel: async (data: Partial<TransactionChannel>) => (await api.post<TransactionChannel>('/transaction-channels', data)).data,

    // Transactions
    getTransactions: async () => (await api.get<Transaction[]>('/transactions')).data,
    createTransaction: async (data: Partial<Transaction>) => (await api.post<Transaction>('/transactions', data)).data,

    // Transfers
    getTransfers: async () => (await api.get<Transfer[]>('/transfers')).data,
    createTransfer: async (data: Partial<Transfer>) => (await api.post<Transfer>('/transfers', data)).data,

    // Dashboard
    getDashboardSummary: async () => (await api.get<DashboardSummary>('/dashboard/summary')).data,
};
