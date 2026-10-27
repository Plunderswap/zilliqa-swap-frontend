import { useReconnect } from 'wagmi'
import { useEffect } from 'react'

const useEagerConnect = () => {
  const { reconnectAsync } = useReconnect()
  useEffect(() => {
    reconnectAsync()
  }, [reconnectAsync])
}

export default useEagerConnect
