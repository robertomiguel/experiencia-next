
export const formatMoney = (amount: number, decimals: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: decimals });
}
