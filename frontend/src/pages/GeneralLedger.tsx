import { useEffect, useState, useCallback } from "react";
import { getLedger } from "../api";
import { formatCents } from "../utils/format";
import type { Transaction } from "../types";

const PAGE_SIZE = 50;

export default function GeneralLedger() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (reset = false) => {
        setLoading(true);
        const offset = reset ? 0 : skip;
        const data = await getLedger(offset, PAGE_SIZE);
        setTransactions(prev => reset ? data : [...prev, ...data]);
        setSkip(offset + data.length);
        setHasMore(data.length === PAGE_SIZE);
        setLoading(false);
    }, [skip]);

    useEffect(() => { load(true); }, []);

    return (
        <div className="p-6">
            <h2 className="text-terminal-muted text-xs tracking-widest mb-6">GENERAL LEDGER</h2>
            <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-terminal-bg">
                    <tr className="text-terminal-muted border-b border-terminal-border">
                        <th className="text-left py-2 pr-4 w-24">DATE</th>
                        <th className="text-left py-2 pr-4">DESCRIPTION</th>
                        <th className="text-left py-2 pr-4">ACCOUNTS AFFECTED</th>
                        <th className="text-right py-2 pr-4 w-28">DEBIT</th>
                        <th className="text-right py-2 w-28">CREDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        tx.entries.map((entry, i) => (
                            <tr key={entry.id} className="border-b border-terminal-border hover:bg-terminal-surface">
                                <td className="py-1.5 pr-4 text-terminal-muted">
                                    {i === 0 ? new Date(tx.posted_at).toLocaleDateString() : ''}
                                </td>
                                <td className="py-1.5 pr-4">
                                    {i === 0 ? tx.description : ''}
                                </td>
                                <td className="py-1.5 pr-4 text-terminal-muted">{entry.account_name}</td>
                                <td className={`py-1.5 pr-4 text-right ${entry.direction === 'DEBIT' ? 'text-terminal-green' : ''}`}>
                                    {entry.direction === 'DEBIT' ? formatCents(entry.amount) : ''}
                                </td>
                                <td className={`py-1.5 text-right ${entry.direction === 'CREDIT' ? 'text-terminal-red' : ''}`}>
                                    {entry.direction === 'CREDIT' ? formatCents(entry.amount) : ''}
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

            {hasMore && (
                <button onClick={() => load()} disabled={loading} className="mt-6 text-xs text-terminal-muted border border-terminal-border px-4 py-2 rounded hover:border-terminal-green hover:text-terminal-green transition-colors">
                    {loading ? 'LOADING...' : 'LOAD MORE'}
                </button>
            )}
        </div>
    );
}