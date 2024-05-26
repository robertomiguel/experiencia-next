'use client'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  return (
    <div className='flex w-fit p-5 gap-3 bg-blue-500 text-gray-50 m-auto mt-40 rounded-full' >
      <h2>{error.message}</h2>
      <button
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}