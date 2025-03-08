'use client'
import { INITIAL_USD_BALANCE, useCoinStore } from "@/store/useCoinStore";
import { buyAction, sellAction } from "./actions";

export const OperationsControl = ({  }: any) => {

    const updateUsdBalance = useCoinStore( state => state.updateUsdBalance)
    const updateBtcBalance = useCoinStore( state => state.updateBtcBalance)
    const updateTransactions = useCoinStore( state => state.updateTransactions)
    const updateOperationStatus = useCoinStore( state => state.updateOperationStatus)
    const updatePendingOperation = useCoinStore( state => state.updatePendingOperation)
    const usdBalance = useCoinStore( state => state.usdBalance)
    const btcBalance = useCoinStore( state => state.btcBalance)
    const pendingOperation = useCoinStore( state => state.pendingOperation)
    const transactions = useCoinStore( state => state.transactions)

    const handleBuy = async (): Promise<void> => {
        if (usdBalance <= 0 || pendingOperation ) return;
        
        updatePendingOperation(true);
        updateOperationStatus('Procesando compra...');
        
        try {
          const result = await buyAction(usdBalance, btcBalance);
          
          if (result.success && result.transaction) {
            updateUsdBalance(result.newUsdBalance);
            updateBtcBalance(result.newBtcBalance);
            
            updateTransactions([
              result.transaction,
              ...transactions
            ]);
            
            updateOperationStatus(result.message);
          } else {
            updateOperationStatus(result.message);
          }
        } catch (error) {
            updateOperationStatus('Error al procesar la compra');
        } finally {
            updatePendingOperation(false);
          setTimeout(() => updateOperationStatus(''), 3000);
        }
      };
    
      const handleSell = async (): Promise<void> => {
        if (btcBalance <= 0 || pendingOperation) return;
        
        updatePendingOperation(true);
        updateOperationStatus('Procesando venta...');
        
        try {
          const result = await sellAction(usdBalance, btcBalance);
          
          if (result.success && result.transaction) {
            updateUsdBalance(result.newUsdBalance);
            updateBtcBalance(result.newBtcBalance);
            
            updateTransactions([
              result.transaction!,
              ...transactions
            ]);
            
            updateOperationStatus(result.message);
          } else {
            updateOperationStatus(result.message);
          }
        } catch (error) {
            updateOperationStatus('Error al procesar la venta');
        } finally {
          updatePendingOperation(false);
          setTimeout(() => updateOperationStatus(''), 3000);
        }
      };
    
      const resetBalance = (): void => {
        updateUsdBalance(INITIAL_USD_BALANCE);
        updateBtcBalance(0);
        updateTransactions([]);
        updateOperationStatus('Balances reiniciados');
        setTimeout(() => updateOperationStatus(''), 3000);
      };

    return <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <button
      onClick={handleBuy}
      disabled={usdBalance <= 0 || pendingOperation}
    >
      {pendingOperation ? 'Comprando...' : 'Comprar BTC'}
    </button>
    
    <button
      onClick={handleSell}
      disabled={btcBalance <= 0 || pendingOperation}
    >
      {pendingOperation ? 'Vendiendo...' : 'Vender BTC'}
    </button>
    
    <button
      onClick={resetBalance}
    >
      Reiniciar
    </button>
  </div>
}