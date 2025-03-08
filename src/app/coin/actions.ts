'use server';

import { revalidatePath } from 'next/cache';

type TransactionResult = {
  success: boolean;
  newUsdBalance: number;
  newBtcBalance: number;
  transaction?: {
    type: 'Compra' | 'Venta';
    usdAmount: number;
    btcAmount: number;
    price: number;
    timestamp: string;
  };
  message: string;
};

async function getBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el precio de Bitcoin');
    }
    
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw new Error('No se pudo obtener el precio actual de Bitcoin');
  }
}

export async function buyAction(
  currentUsdBalance: number,
  currentBtcBalance: number
): Promise<TransactionResult> {
  if (currentUsdBalance <= 0) {
    return {
      success: false,
      newUsdBalance: currentUsdBalance,
      newBtcBalance: currentBtcBalance,
      message: 'Saldo USD insuficiente'
    };
  }

  try {
    // Obtener el precio actual de Bitcoin desde el servidor
    const price = await getBitcoinPrice();
    
    // Simular delay de la transacción
    await new Promise(resolve => setTimeout(resolve, 200));

    const btcAmount = currentUsdBalance / price;
    const timestamp = new Date().toLocaleString();

    const transaction = {
      type: 'Compra' as const,
      usdAmount: currentUsdBalance,
      btcAmount,
      price,
      timestamp
    };

    revalidatePath('/');
    
    return {
      success: true,
      newUsdBalance: 0,
      newBtcBalance: currentBtcBalance + btcAmount,
      transaction,
      message: '¡Compra completada!'
    };
  } catch (error) {
    return {
      success: false,
      newUsdBalance: currentUsdBalance,
      newBtcBalance: currentBtcBalance,
      message: 'Error al procesar la compra'
    };
  }
}

export async function sellAction(
  currentUsdBalance: number,
  currentBtcBalance: number
): Promise<TransactionResult> {
  if (currentBtcBalance <= 0) {
    return {
      success: false,
      newUsdBalance: currentUsdBalance,
      newBtcBalance: currentBtcBalance,
      message: 'Saldo BTC insuficiente'
    };
  }

  try {
    // Obtener el precio actual de Bitcoin desde el servidor
    const price = await getBitcoinPrice();
    
    // Simular delay de la transacción
    await new Promise(resolve => setTimeout(resolve, 150));

    const usdAmount = currentBtcBalance * price;
    const timestamp = new Date().toLocaleString();

    const transaction = {
      type: 'Venta' as const,
      usdAmount,
      btcAmount: currentBtcBalance,
      price,
      timestamp
    };

    revalidatePath('/');
    
    return {
      success: true,
      newUsdBalance: currentUsdBalance + usdAmount,
      newBtcBalance: 0,
      transaction,
      message: '¡Venta completada!'
    };
  } catch (error) {
    return {
      success: false,
      newUsdBalance: currentUsdBalance,
      newBtcBalance: currentBtcBalance,
      message: 'Error al procesar la venta'
    };
  }
}