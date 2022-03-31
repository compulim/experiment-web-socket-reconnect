import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [disabled, setDisabled] = useState(true);
  const [log, setLog] = useState([]);
  const [value, setValue] = useState('');
  const [webSocket, setWebSocket] = useState();

  const valueRef = useRef();

  valueRef.current = value;

  const handleChange = useCallback(({ target: { value } }) => setValue(value), [setValue]);
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      const { current: value } = valueRef;

      if (value) {
        webSocket?.send(value);
        setLog(log => [...log, `ws.send(${JSON.stringify(value)})`]);
        setValue('');
      }
    },
    [setLog, setValue, valueRef, webSocket]
  );

  useEffect(() => {
    const ws = new WebSocket(
      `${window.location.protocol === 'http' ? 'ws' : 'wss'}://${window.location.host}/api/socket`
    );
    // const ws = new WebSocket(`ws://${window.location.host}/api`);
    // const ws = new WebSocket(`ws://localhost:5001/api/socket`);

    setLog(log => [...log, `new WebSocket(${JSON.stringify(ws.url)})`]);

    ws.addEventListener('message', ({ data }) =>
      setLog(log => [...log, `ws.onmessage({ data: ${JSON.stringify(data)} })`])
    );

    ws.addEventListener('open', () => {
      setLog(log => [...log, 'ws.onopen()']);
      setDisabled(false);
      setWebSocket(ws);
    });

    ws.addEventListener('close', () => setLog(log => [...log, 'ws.onclose()']));

    ws.addEventListener('error', event => {
      console.log(event);

      setLog(log => [...log, 'ws.onerror()']);
    });

    return () => {
      ws.close();
      setDisabled(true);
    };
  }, [setDisabled, setLog, setWebSocket]);

  return (
    <div className="app">
      <div role="log">
        {log.map((line, index) => (
          <article key={index}>{line}</article>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input disabled={disabled} onChange={handleChange} type="text" value={value} />
      </form>
    </div>
  );
}

export default App;
