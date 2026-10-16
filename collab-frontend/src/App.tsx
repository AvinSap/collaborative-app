import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { COLLABEVENT, type Operation } from './types/collab'

const BOARD_ID = 'board-1'

export default function App() {
  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState('connecting...')
  const [received, setReceived] = useState<Operation[]>([])

  useEffect(() => {
    const socket = io()
    socketRef.current = socket

    socket.on('connect', async () => {
      setStatus(`connected as ${socket.id}`)
      const res = await socket.emitWithAck(COLLABEVENT.JOIN_BOARD, { boardId: BOARD_ID })
      if (res?.joined) setStatus(`connected as ${socket.id}, joined ${BOARD_ID}`)
    })

    socket.on(COLLABEVENT.OPERATION, (op: Operation) => {
      setReceived((prev) => [...prev, op])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendTest = () => {
    const op: Operation = {
      operationId: crypto.randomUUID(),
      boardId: BOARD_ID,
      clientId: socketRef.current?.id ?? 'unknown',
      type: 'object.created',
      payload: { shape: 'rectangle', x: 100, y: 100 },
    }
    socketRef.current?.emit(COLLABEVENT.OPERATION, op)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <p>{status}</p>
      <button onClick={sendTest}>Send test operation</button>
      <h3>Received from others:</h3>
      <pre>{JSON.stringify(received, null, 2)}</pre>
    </div>
  )
}