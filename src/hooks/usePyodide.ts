'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PyodideClient, PyodideRunResult } from '@/lib/pyodide/PyodideClient';

export function usePyodide() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo...');
  const clientRef = useRef<PyodideClient | null>(null);

  useEffect(() => {
    const client = PyodideClient.getInstance();
    clientRef.current = client;

    const unsubscribe = client.subscribeStatus((status, message) => {
      setIsReady(status === 'ready');
      setIsLoading(status === 'loading');
      setStatusMessage(message);
    });

    client.init();

    return () => {
      unsubscribe();
    };
  }, []);

  const runPython = useCallback(
    async (
      code: string,
      stdin?: string,
      onChunk?: (type: 'stdout' | 'stderr', text: string) => void,
      timeoutMs: number = 5000
    ): Promise<PyodideRunResult> => {
      const client = clientRef.current || PyodideClient.getInstance();
      return client.runCode({
        code,
        stdin,
        timeoutMs,
        onStdout: (text) => onChunk?.('stdout', text),
        onStderr: (text) => onChunk?.('stderr', text),
      });
    },
    []
  );

  const resetRuntime = useCallback(() => {
    const client = clientRef.current || PyodideClient.getInstance();
    client.resetScope();
  }, []);

  return {
    isReady,
    isLoading,
    statusMessage,
    runPython,
    resetRuntime,
  };
}
