import { useEffect, useState } from "react";
import { getAccounts, createTransaction } from "../api";
import { dollarsToCents, formatCents } from "../utils/format";
import type { Account, Direction } from "../types";

interface EntryRow {
    account_id: string;
    amount: string;
    direction: Direction;
}

export default function JournalEntry() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState<EntryRow[]>([
        { account_id: '', amount: '', direction: 'DEBIT' },
        { account_id: '', amount: '', direction: 'CREDIT' },
    ]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { getAccounts().then(setAccounts); }, []);

    const totalDebits = entries.filter(e => e.direction === 'DEBIT').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalCredits = entries.filter(e => e.direction === 'CREDIT').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const isBalanced = totalDebits > 0 && totalDebits === totalCredits;
    const difference = Math.abs(totalDebits - totalCredits)

    const addRow = () => 
        setEntries([...entries, { account_id: '', amount: '', direction: 'DEBIT' }]);

    const updateEntry = (i: number, field: keyof EntryRow, value: string) => {
        const next = [...entries];
        next[i] = { ...next[i], [field]: value };
        setEntries(next);
    };

    const handleSubmit = async () => {
        try {
            await createTransaction({
                description,
                entries: entries.map(e => ({
                    account_id: e.account_id,
                    amount: dollarsToCents(e.amount),
                    direction: e.direction,
                })),
            });
            setSuccess('Transaction posted successfully!');
            setDescription('');
            setEntries([
                { account_id: '', amount: '', direction: 'DEBIT' },
                { account_id: '', amount: '', direction: 'CREDIT' },
            ]);
        } catch (e: any) {
            setError(e.response?.data?.detail || 'Something went wrong');
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h2 className="text-terminal-muted text-xs tracking-widest mb-6">NEW JOURNAL ENTRY</h2>

            <input className="w-full bg-terminal-surface border border-terminal-border rounded px-3 py-2 mb-6 text-sm focus:border-terminal-green outline-none"
                   placeholder="Description (e.g. Invoice #123 - Client Revenue)"
                   value={description}
                   onChange={e => setDescription(e.target.value)} 
            />

            <table className="w-full text-sm mb-4">
                <thead>
                    <tr className="text-terminal-muted text-xs border-b border-terminal-border">
                        <th className="text-left pb-2 w-1/2">ACCOUNT</th>
                        <th className="text-left pb-2 w-1/4">AMOUNT ($)</th>
                        <th className="text-left pb-2 w-1/4">DR / CR</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, i) => (
                        <tr key={i} className="border-b border-terminal-border">
                            <td className="py-2 pr-2">
                                <select className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-xs"
                                        value={entry.account_id}
                                        onChange={e => updateEntry(i, 'account_id', e.target.value)}
                                >
                                    <option value="">Select account...</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 pr-2">
                                <input type="number" step="0.01" min="0" className="w-full bg-trminal border border-terminal-border rounded px-2 py-1 text-xs" 
                                       placeholder="0.00" value={entry.amount} onChange={e => updateEntry(i, 'amount', e.target.value)} 
                                />
                            </td>
                            <td className="py-2">
                                    <div className="flex gap-2">
                                        {(['DEBIT', 'CREDIT'] as Direction[]).map(d => (
                                            <label key={d} className="flex items-center gap-1 cursor-pointer">
                                                <input type="radio" name={`dir-${i}`} value={d} checked={entry.direction===d} onChange={() => updateEntry(i, 'direction', d)} className="accent-terminal-green" />
                                                <span className="text-xs">{d[0]}</span>
                                            </label>
                                        ))}
                                    </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={addRow}
                className="text-xs text-terminal-muted border border-terminal-border px-3 py-1 rounded hover:border-terminal-green hover:text-terminal-green transition-colors mb-6"
            >
                + ADD LINE
            </button>

            <div className={`text-sm font-mono mb-4 ${isBalanced ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {isBalanced ? 'BALANCED' : `OUT OF BALANCE - ${formatCents(Math.round(difference * 100))}`}
            </div>

            {error && <p className="text-terminal-red text-xs mb-4">{error}</p>}
            {success && <p className="text-terminal-green text-xs mb-4">{success}</p>}

            <button
                disabled={!isBalanced || !description}
                onClick={handleSubmit}
                className="bg-terminal-green text-terminal-bg font-medium px-6 py-2 rounded text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-90 transition-opacity"
            >
                POST TRANSACTION
            </button>
        </div>
    );
}