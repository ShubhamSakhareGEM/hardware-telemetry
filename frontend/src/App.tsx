import { useState, useEffect } from 'react';
import './App.css';

interface TelemetryData {
  server_temperature_c: number;
  network_latency_ms: number;
  cpu_utilization_pct: number;
  optical_node_status: string;
}

function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    try {
      // fetching from the FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/api/telemetry');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setTelemetry(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch telemetry data.');
      console.error(err);
    }
  };

  useEffect(() => {
    // fetch immediately on mount
    fetchTelemetry();
    // poll every 1 second
    const interval = setInterval(fetchTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Hardware Telemetry Dashboard</h1>
      {error && <p className="error">{error}</p>}
      
      {!telemetry && !error ? (
        <p>Loading sensors...</p>
      ) : (
        <div className="grid">
          <div className="card">
            <h3>CPU Temp</h3>
            <p className={telemetry?.server_temperature_c! > 75 ? 'danger' : 'safe'}>
              {telemetry?.server_temperature_c} <span className="unit">°C</span>
            </p>
          </div>
          <div className="card">
            <h3>Latency</h3>
            <p>{telemetry?.network_latency_ms} <span className="unit">ms</span></p>
          </div>
          <div className="card">
            <h3>CPU Usage</h3>
            <p>{telemetry?.cpu_utilization_pct} <span className="unit">%</span></p>
          </div>
          <div className="card">
            <h3>Optical Node</h3>
            <p className={telemetry?.optical_node_status === 'Active' ? 'safe' : 'danger'}>
              {telemetry?.optical_node_status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;