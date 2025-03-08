/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useCoinStore } from '@/store/useCoinStore';
import React, { useEffect, useRef, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MAX_PRICE_HISTORY = 100;
const MIN_UPDATE_INTERVAL = 10000; // Mínimo 10 segundos entre actualizaciones
const MIN_PRICE_CHANGE_THRESHOLD = 0.05; // 0.05% de cambio mínimo para registrar

const BitcoinPriceChart = () => {
  const currentPrice = useCoinStore((state) => state.bitcoinPrice)

  const history = useCoinStore((state) => state.history);
  const updateHistory = useCoinStore((state) => state.updateHistory);
  const lastPriceRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const { transactions } = useCoinStore();
  
  // Inicializar con el precio actual si es la primera vez
  useEffect(() => {
    if (currentPrice > 0 && history.length === 0) {
      const now = new Date();
      updateHistory([{
        time: now.toLocaleTimeString(),
        price: currentPrice,
        buy: null,
        sell: null
      }]);
      lastPriceRef.current = currentPrice;
      lastUpdateTimeRef.current = Date.now();
    }
  }, [currentPrice, history.length]);
  
  // Actualizar cuando el precio cambia, con restricciones
  useEffect(() => {
    if (currentPrice <= 0) return;
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    
    // Calcular el cambio porcentual desde el último precio registrado
    const percentChange = lastPriceRef.current > 0 
      ? Math.abs((currentPrice - lastPriceRef.current) / lastPriceRef.current * 100) 
      : 0;
    
    // Actualizar solo si:
    // 1. Ha pasado suficiente tiempo desde la última actualización O
    // 2. El cambio de precio es significativo
    if (timeSinceLastUpdate >= MIN_UPDATE_INTERVAL || percentChange >= MIN_PRICE_CHANGE_THRESHOLD) {
      lastPriceRef.current = currentPrice;
      lastUpdateTimeRef.current = now;
      
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        price: currentPrice,
        buy: null,
        sell: null
      };
      
      // FIFO: mantener exactamente MAX_PRICE_HISTORY puntos
      const updatedHistory = [...history, newPoint];
      if (updatedHistory.length > MAX_PRICE_HISTORY) {
        updateHistory(updatedHistory.slice(updatedHistory.length - MAX_PRICE_HISTORY));
      } else {
        updateHistory(updatedHistory);
      }
    }
  }, [currentPrice, history]);
  
  // Aplicar las transacciones al historial de precios
  useEffect(() => {
    if (transactions.length === 0 || history.length === 0) return;
    
    // Mapa para búsqueda rápida
    const transactionMap = new Map();
    transactions.forEach(tx => {
      transactionMap.set(tx.timestamp, {
        type: tx.type,
        price: tx.price
      });
    });
    
    // Actualizar los puntos con las transacciones
    updateHistory(history.map(point => {
      const tx = transactionMap.get(point.time);
      if (tx) {
        return {
          ...point,
          buy: tx.type === 'Compra' ? tx.price : null,
          sell: tx.type === 'Venta' ? tx.price : null
        };
      }
      return point;
    }));
  }, [transactions]);
  
  // Calcular tiempo estimado representado en el gráfico
  const timeRangeText = useMemo(() => {
    if (history.length < 2) return "Esperando datos...";
    
    const firstPoint = history[0];
    const lastPoint = history[history.length - 1];
    
    // Extraer horas y minutos
    const firstTime = firstPoint.time.split(':');
    const lastTime = lastPoint.time.split(':');
    
    return `${firstTime[0]}:${firstTime[1]} → ${lastTime[0]}:${lastTime[1]}`;
  }, [history]);
  
  // Custom tooltip para mostrar detalles
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
          <p className="text-white font-semibold">{payload[0].payload.time}</p>
          <p className="text-yellow-400">
            Precio: ${parseFloat(payload[0].value).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          {payload[0].payload.buy && (
            <p className="text-green-400">Compra: Sí</p>
          )}
          {payload[0].payload.sell && (
            <p className="text-red-400">Venta: Sí</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Evolución del Precio</h2>
        <div className="text-sm text-gray-300">
          Rango: {timeRangeText}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }} 
              tickMargin={10}
              tickFormatter={(value) => {
                const parts = value.split(':');
                return `${parts[0]}:${parts[1]}`;
              }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF' }} 
              tickMargin={10} 
              domain={['auto', 'auto']}
              width={90}
              tickFormatter={(value) => `${value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#FBBF24" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6, fill: '#FBBF24' }} 
            />
            <Line 
              type="monotone" 
              dataKey="buy" 
              stroke="none"
              strokeWidth={0}
              dot={{ r: 6, fill: "#10B981", stroke: "#10B981", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#10B981" }}
              connectNulls={true}
            />
            <Line 
              type="monotone" 
              dataKey="sell" 
              stroke="none"
              strokeWidth={0}
              dot={{ r: 6, fill: "#EF4444", stroke: "#EF4444", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#EF4444" }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>
            <span>Precio</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Compra</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
            <span>Venta</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {history.length} de {MAX_PRICE_HISTORY} puntos • Min. {MIN_UPDATE_INTERVAL/1000}s o Δ{MIN_PRICE_CHANGE_THRESHOLD}%
        </div>
      </div>
    </div>
  );
};

export default BitcoinPriceChart;