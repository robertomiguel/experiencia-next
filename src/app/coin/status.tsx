import { useCoinStore } from '@/store/useCoinStore'

export const Status = () => {
  const operationStatus = useCoinStore((state) => state.operationStatus)

  return (
    <div className="bg-blue-900 text-white p-3 rounded-md mb-6 text-center">
      {operationStatus || '...'}
    </div>
  )
}
