'use client';
import React from 'react';
import BitcoinPriceChart from './chartsPrice';
import { History } from './history';
import { OperationsControl } from './operationsControl';
import { Wallet } from './wallet';
import { Monitor } from './monitor';
import { Status } from './status';

const BitcoinTrader: React.FC = () => {

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Binance - Trading Bitcoin</h1>
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 mb-6">
        
        <Monitor />

        <Status />

        <Wallet />
        
        <OperationsControl />
        
      </div>

      <BitcoinPriceChart />
      
      <History />
    </div>
  );
};

export default BitcoinTrader;