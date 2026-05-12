import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(userId: number | null) {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<any>(null);

  const connect = useCallback(() => {
    if (!userId) return;
    
    // In production, use wss:// and proper host
    const socketUrl = `ws://localhost:8000/ws/${userId}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected. Reconnecting...");
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(connect, 3000); // Reconnect in 3s
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket Error", err);
      ws.current?.close();
    };
  }, [userId]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.onclose = null; // Prevent reconnect on intentional unmount
        ws.current.close();
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  const sendMessage = (msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return { lastMessage, isConnected, sendMessage };
}
