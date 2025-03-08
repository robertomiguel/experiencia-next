'use client';

import React, { useEffect, useState, useMemo } from 'react';

const INITIAL_USD_BALANCE: number = 10000;
const BUY_DELAY_MS: number = 200; // 200ms para simular una compra
const SELL_DELAY_MS: number = 150; // 150ms para simular una venta

interface Transaction {
  type: 'Compra' | 'Venta';
  usdAmount: number;
  btcAmount: number;
  price: number;
  timestamp: string;
}

const useBitcoinPrice = (): { price: number; isLoading: boolean } => {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Obtener precio inicial
    const fetchInitialPrice = async (): Promise<void> => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data: any = await response.json();
        setPrice(parseFloat(data.price));
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener el precio inicial de Bitcoin:', error);
        setIsLoading(false);
      }
    };

    fetchInitialPrice();

    // Configurar WebSocket para actualizaciones en tiempo real
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    
    socket.onopen = () => {
      console.log('Conexión WebSocket establecida');
    };

    socket.onmessage = (event: MessageEvent) => {
      const data: any = JSON.parse(event.data);
      if (data.p) {
        setPrice(parseFloat(data.p));
        setIsLoading(false);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('Error en WebSocket:', error);
    };

    // Limpiar WebSocket al desmontar
    return () => {
      socket.close();
    };
  }, []);

  return { price, isLoading };
};

const BitcoinTrader: React.FC = () => {
  const { price, isLoading } = useBitcoinPrice();
  const [usdBalance, setUsdBalance] = useState<number>(INITIAL_USD_BALANCE);
  const [btcBalance, setBtcBalance] = useState<number>(0);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [operationStatus, setOperationStatus] = useState<string>('');

  const formattedPrice = useMemo(
    () => price.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [price]
  );

  const formattedUsdBalance = useMemo(
    () => usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [usdBalance]
  );

  const formattedBtcBalance = useMemo(
    () => btcBalance.toLocaleString('en-US', { minimumFractionDigits: 8 }),
    [btcBalance]
  );

  const portfolioValueUsd = useMemo(
    () => usdBalance + (btcBalance * price),
    [usdBalance, btcBalance, price]
  );

  const formattedPortfolioValue = useMemo(
    () => portfolioValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    [portfolioValueUsd]
  );

  const handleBuy = (): void => {
    if (usdBalance <= 0 || isBuying || isSelling) return;
    
    setIsBuying(true);
    setOperationStatus('Procesando compra...');
    
    // Simular delay en la compra
    setTimeout(() => {
      const btcAmount = usdBalance / price;
      const timestamp = new Date().toLocaleTimeString();
      
      setBtcBalance(prev => prev + btcAmount);
      setUsdBalance(0);
      
      setTransactions(prev => [
        {
          type: 'Compra',
          usdAmount: usdBalance,
          btcAmount,
          price,
          timestamp
        },
        ...prev
      ]);
      
      setIsBuying(false);
      setOperationStatus('¡Compra completada!');
      
      // Limpiar mensaje de estado después de 3 segundos
      setTimeout(() => setOperationStatus(''), 3000);
    }, BUY_DELAY_MS);
  };

  const handleSell = (): void => {
    if (btcBalance <= 0 || isBuying || isSelling) return;
    
    setIsSelling(true);
    setOperationStatus('Procesando venta...');
    
    // Simular delay en la venta
    setTimeout(() => {
      const usdAmount = btcBalance * price;
      const timestamp = new Date().toLocaleTimeString();
      
      setUsdBalance(prev => prev + usdAmount);
      setBtcBalance(0);
      
      setTransactions(prev => [
        {
          type: 'Venta',
          usdAmount,
          btcAmount: btcBalance,
          price,
          timestamp
        },
        ...prev
      ]);
      
      setIsSelling(false);
      setOperationStatus('¡Venta completada!');
      
      // Limpiar mensaje de estado después de 3 segundos
      setTimeout(() => setOperationStatus(''), 3000);
    }, SELL_DELAY_MS);
  };

  const resetBalance = (): void => {
    setUsdBalance(INITIAL_USD_BALANCE);
    setBtcBalance(0);
    setTransactions([]);
    setOperationStatus('Balances reiniciados');
    setTimeout(() => setOperationStatus(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">Cargando datos de Bitcoin...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Emulador de Trading Bitcoin</h1>
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Precio Actual de Bitcoin</h2>
            <p className="text-4xl font-bold text-yellow-400">${formattedPrice}</p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Valor Total del Portfolio</h2>
            <p className="text-4xl font-bold text-green-400">${formattedPortfolioValue}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Balance USD</h2>
            <p className="text-3xl font-bold">${formattedUsdBalance}</p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Balance BTC</h2>
            <p className="text-3xl font-bold">{formattedBtcBalance} BTC</p>
          </div>
        </div>
        
        {operationStatus && (
          <div className="bg-blue-900 text-white p-3 rounded-md mb-6 text-center">
            {operationStatus}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBuy}
            disabled={usdBalance <= 0 || isBuying || isSelling}
            className={`px-6 py-3 rounded-lg text-white font-bold text-lg ${
              usdBalance > 0 && !isBuying && !isSelling 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isBuying ? 'Comprando...' : 'Comprar BTC ($10)'}
          </button>
          
          <button
            onClick={handleSell}
            disabled={btcBalance <= 0 || isBuying || isSelling}
            className={`px-6 py-3 rounded-lg text-white font-bold text-lg ${
              btcBalance > 0 && !isBuying && !isSelling 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isSelling ? 'Vendiendo...' : 'Vender BTC'}
          </button>
          
          <button
            onClick={resetBalance}
            className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg"
          >
            Reiniciar
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Historial de Transacciones</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No hay transacciones registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Hora</th>
                  <th className="px-4 py-2 text-right">Cantidad USD</th>
                  <th className="px-4 py-2 text-right">Cantidad BTC</th>
                  <th className="px-4 py-2 text-right">Precio BTC</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
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
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>* Los tiempos de operación son simulados: Compra ({BUY_DELAY_MS}ms), Venta ({SELL_DELAY_MS}ms)</p>
        <p>* Los precios se actualizan en tiempo real desde Binance</p>
      </div>
    </div>
  );
};

export default BitcoinTrader;