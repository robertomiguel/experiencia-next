'use client'
import { useCoinStore } from "@/store/useCoinStore";
import { useEffect, useState } from "react";

export const useBitcoinPrice = (): { isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const updateBitcoinPrice = useCoinStore(state => state.updateBitcoinPrice);

  useEffect(() => {
    setIsLoading(true);
    
    // Obtener precio inicial
    const fetchInitialPrice = async (): Promise<void> => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data: any = await response.json();
        updateBitcoinPrice(parseFloat(data.price));
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener el precio inicial de Bitcoin:', error);
        setIsLoading(false);
      }
    };

    fetchInitialPrice();

    // Usar el endpoint @ticker para actualizaciones menos frecuentes
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    
    /* socket.onopen = () => {
      console.log('Conexión WebSocket establecida');
    }; */

    socket.onmessage = (event: MessageEvent) => {
      const data: any = JSON.parse(event.data);
      if (data.c) { // El precio de cierre actual está en 'c' para los tickers
        updateBitcoinPrice(parseFloat(data.c));
        setIsLoading(false);
      }
    };

    /* socket.onerror = (error: Event) => {
      console.log('Error en WebSocket:', error);
    }; */

    // Limpiar WebSocket al desmontar
    return () => {
      socket.close();
    };
  }, [updateBitcoinPrice]);

  return { isLoading };
};