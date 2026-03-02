export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Account {
    id: number;
    name: string;
    type: string;
    initial_balance: number;
    current_balance: number;
    user_id: number;
}

export interface TransactionChannel {
    id: number;
    name: string;
    account_id: number;
}

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    user_id: number;
}

export interface Person {
    id: number;
    name: string;
    user_id: number;
}

export interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    person_id?: number | null;
    channel_id?: number | null;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    description: string;
    account?: Account;
    category?: Category;
    person?: Person;
    channel?: TransactionChannel;
}

export interface Transfer {
    id: number;
    from_account_id: number;
    to_account_id: number;
    amount: number;
    date: string;
    description?: string;
    from_account?: Account;
    to_account?: Account;
}

export interface DashboardSummary {
    total_balance: number;
    monthly_income: number;
    monthly_expense: number;
    accounts: Account[];
    recent_transactions: Transaction[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
