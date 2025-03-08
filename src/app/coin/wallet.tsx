import { useCoinStore } from '@/store/useCoinStore'
import { formatMoney } from './formatMoney'

export const Wallet = () => {
  const usdBalance = useCoinStore((state) => state.usdBalance)
  const btcBalance = useCoinStore((state) => state.btcBalance)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Balance USD</h2>
          <p className="text-3xl font-bold">${formatMoney(usdBalance, 2)}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Balance BTC</h2>
          <p className="text-3xl font-bold">{formatMoney(btcBalance, 8)} BTC</p>
        </div>
      </div>
    </>
  )
}
