type WebSocketEventCallback = (data: any) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout = 1000;
  private eventListeners: Map<string, WebSocketEventCallback[]> = new Map();
  private isConnecting = false;

  constructor(userId: string) {
    // Assuming backend runs on 8000
    this.url = `ws://localhost:8000/ws/${userId}`;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected.");
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventType = data.type;
        if (eventType && this.eventListeners.has(eventType)) {
          this.eventListeners.get(eventType)?.forEach((cb) => cb(data));
        }
      } catch (error) {
        console.error("Failed to parse websocket message", error);
      }
    };

    this.ws.onclose = () => {
      console.warn("WebSocket closed.");
      this.isConnecting = false;
      this.ws = null;
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.ws?.close();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${timeout}ms...`);
      setTimeout(() => this.connect(), timeout);
    } else {
      console.error("Max WebSocket reconnect attempts reached.");
    }
  }

  public send(eventType: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: eventType, ...payload }));
    } else {
      console.warn("Cannot send message, WebSocket is not open.");
      // Ideally queue the message here
    }
  }

  public on(eventType: string, callback: WebSocketEventCallback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)?.push(callback);
  }

  public off(eventType: string, callback: WebSocketEventCallback) {
    if (this.eventListeners.has(eventType)) {
      const callbacks = this.eventListeners.get(eventType)?.filter((cb) => cb !== callback);
      if (callbacks) {
        this.eventListeners.set(eventType, callbacks);
      }
    }
  }

  public disconnect() {
    this.maxReconnectAttempts = 0; // Prevent auto-reconnect on manual disconnect
    this.ws?.close();
  }
}

// Singleton instance for global app usage
export const wsClient = new WebSocketClient("default_user_123"); 
