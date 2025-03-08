import { useCoinStore } from "@/store/useCoinStore"


export const History = () => {

    const transactions = useCoinStore( state => state.transactions)

    return <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6">
    <h2 className="text-2xl font-semibold mb-4">Historial de Transacciones</h2>
    
    {transactions.length === 0 ? (
      <p className="text-gray-400 text-center py-6">No hay transacciones registradas</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Fecha/Hora</th>
              <th className="px-4 py-2 text-right">Cantidad USD</th>
              <th className="px-4 py-2 text-right">Cantidad BTC</th>
              <th className="px-4 py-2 text-right">Precio BTC</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any, index: number) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} border-b border-gray-700`}>
                <td className={`px-4 py-3 ${tx.type === 'Compra' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type}
                </td>
                <td className="px-4 py-3">{tx.timestamp}</td>
                <td className="px-4 py-3 text-right">${tx.usdAmount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{tx.btcAmount.toFixed(8)}</td>
                <td className="px-4 py-3 text-right">${tx.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>      
}
