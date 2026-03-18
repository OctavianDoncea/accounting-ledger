export const formatCents = (cents: number): string => {
    const abs = Math.abs(cents);
    const formatted = (abs / 100).toLocaleString('en-US',{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return cents < 0 ? `-$${formatted}` : `$${formatted}`;
};

export const dollarsToCents = (dollars: string): number =>
    Math.round(parseFloat(dollars) * 100)