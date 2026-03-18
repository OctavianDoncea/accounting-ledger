import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getAccounts, getLedger } from "../api";
import { formatCents } from "../utils/format";
import type { Account, Transaction } from "../types";

export default function Dashboard() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getAccounts().then(setAccounts);
        getLedger(0, 5).then(setTransactions);
    }, []);

    const assets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
    const liabilities = accounts.filter(a => a.type === 'LIABILTY').reduce((sum, a) => sum + a.balance, 0);
    const equity = assets - liabilities;

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'TOTAL ASSETS', value: assets, color: 'terminal-green' },
                    { label: 'TOTAL LIABILITIES', value: liabilities, color: 'terminal-red' },
                    { label: 'NET EQUITY', value: equity, color: 'terminal-amber' }
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-terminal-surface border border-terminal-border rounded p-4">
                        <p className="text-terminal-muted text-xs tracking-widest">{label}</p>
                        <p className={`text-2xl font-medium text-${color} mt-1`}>{formatCents(value)}</p>
                    </div>
                ))}
            </div>

            <div className="bg-terminal-surface border border-terminal-border rounded p-4">
                <p className="text-terminal-muted text-ts tracking-widest mb-4">CASH ON HAND - 30 DAYS</p>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[]}>
                        <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11, fontFamily: 'Fira Code' }} />
                        <YAxis stroke="#666" tick={{ fontSize: 11, fontFamily: 'Fira Code' }} />
                        <Tooltip contentStyle={{ background: '#111', border: '1px solid #1f1f1f', fontFamily: 'Fira Code' }} />
                        <Line type="monotone" dataKey="balance" stroke="#00ff88" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-terminal-surface border border-terminal-border rounded p-4">
                <p className="text-terminal-muted text-xs tracking-widest mb-4">RECENT TRANSACTIONS</p>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-terminal-muted text-xs border-b border-terminal-border">
                            <th className="text-left pb-2">DATE</th>
                            <th className="text-left pb-2">DESCRIPTION</th>
                            <th className="text-right pb-2">ENTRIES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b border-terminal-border last:border-0">
                                <td className="py-2 text-terminal-muted text-xs">
                                    {new Date(tx.posted_at).toLocaleDateString()}
                                </td>
                                <td className="py-2">{tx.description}</td>
                                <td className="py-2 text-right text-terminal-muted">{tx.entries.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}