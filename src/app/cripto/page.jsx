'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const topCryptos = [
  'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'TRX', 'DOT', 'MATIC'
];

const fetchCryptoData = async (symbol) => {
  try {
    const responses = await Promise.allSettled([
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`).then(res => res.json()),
      fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}USDT&limit=5`).then(res => res.json()),
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`).then(res => res.json()),
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`).then(res => res.json()),
      fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1m&limit=100`).then(res => res.json())
    ]);
    
    const [priceRes, depthRes, statsRes, avgPriceRes, historyRes] = responses.map(res => res.status === 'fulfilled' ? res.value : {});

    return {
      price: priceRes?.price ? parseFloat(priceRes.price) : 0,
      bids: depthRes?.bids ? depthRes.bids.slice(0, 5) : [],
      asks: depthRes?.asks ? depthRes.asks.slice(0, 5) : [],
      volume: statsRes?.volume ? parseFloat(statsRes.volume) : 0,
      high: statsRes?.highPrice ? parseFloat(statsRes.highPrice) : 0,
      low: statsRes?.lowPrice ? parseFloat(statsRes.lowPrice) : 0,
      avgPrice: avgPriceRes?.price ? parseFloat(avgPriceRes.price) : 0,
      spread: depthRes?.bids?.length && depthRes?.asks?.length ? Math.abs(parseFloat(depthRes.asks[0][0]) - parseFloat(depthRes.bids[0][0])) : 0,
      history: historyRes?.length ? historyRes.map(([time, open]) => ({
        time: new Date(time).toLocaleTimeString(),
        price: parseFloat(open)
      })) : []
    };
  } catch (error) {
    console.error('Error al obtener datos de la criptomoneda:', error);
    return null;
  }
};

const useCryptoData = (symbol) => {
  const [data, setData] = useState(null);
  
  const updateData = useCallback(async () => {
    const newData = await fetchCryptoData(symbol);
    if (newData) {
      setData(newData);
    }
  }, [symbol]);

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, [updateData]);

  return data;
};

const CryptoChart = React.memo(({ history }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={history}>
      <XAxis dataKey="time" hide={false} />
      <YAxis domain={['auto', 'auto']} />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#f7931a" dot={false} />
    </LineChart>
  </ResponsiveContainer>
));
CryptoChart.displayName = 'CryptoChart';

const CryptoMonitor = React.memo(() => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const data = useCryptoData(selectedCrypto);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold">Monitor de Precio de Criptomonedas</h1>
      <div className="mt-4 flex gap-2">
        {topCryptos.map((crypto) => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto)}
            className={`px-4 py-2 rounded ${selectedCrypto === crypto ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            {crypto}
          </button>
        ))}
      </div>
      {data ? (
        <div className="text-center mt-4">
          <p className="text-4xl">${data.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <CryptoChart history={data.history} />
          <p className="mt-2 text-lg">Volumen 24h: {data.volume.toLocaleString()} {selectedCrypto}</p>
          <p className="text-lg">Máximo 24h: ${data.high.toLocaleString()}</p>
          <p className="text-lg">Mínimo 24h: ${data.low.toLocaleString()}</p>
          <p className="text-lg">Precio Promedio 5min: ${data.avgPrice.toLocaleString()}</p>
          <p className={`text-lg ${data.spread <= 0.01 ? 'text-green-500' : data.spread <= 0.05 ? 'text-yellow-500' : 'text-red-500'}`}>Spread: ${data.spread.toFixed(2)} USD</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
});
CryptoMonitor.displayName = 'CryptoMonitor';

const Page = () => <CryptoMonitor />;

export default Page;
