import { useCoinStore } from '@/store/useCoinStore'
import { useMemo } from 'react'
import { formatMoney } from './formatMoney'
import { useBitcoinPrice } from './useBitcoinPrice'

export const Monitor = () => {
  const price = useCoinStore((state) => state.bitcoinPrice)

  const { isLoading } = useBitcoinPrice()  

  const usdBalance = useCoinStore((state) => state.usdBalance)
  const btcBalance = useCoinStore((state) => state.btcBalance)

  const portfolioValueUsd = useMemo(
    () => usdBalance + btcBalance * price,
    [usdBalance, btcBalance, price]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Cargando datos de Bitcoin...</h1>
      </div>
    )
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Precio Actual de Bitcoin
          </h2>
          <p className="text-4xl font-bold text-yellow-400">
            ${formatMoney(price, 2)}
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Valor Total del Portfolio
          </h2>
          <p className="text-4xl font-bold text-green-400">
            ${formatMoney(portfolioValueUsd, 3)}
          </p>
        </div>
      </div>
    </>
  )
}
