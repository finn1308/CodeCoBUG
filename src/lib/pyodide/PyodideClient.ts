/**
 * CodeCoBUG Pyodide Worker Client
 * Manages the lifecycle of the browser Web Worker, handles timeouts via Watchdog,
 * and streams standard I/O between Python and the Terminal.
 */

export interface PyodideRunOptions {
  code: string;
  stdin?: string;
  timeoutMs?: number;
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
}

export interface PyodideRunResult {
  status: 'completed' | 'error' | 'timeout';
  stdout: string;
  stderr: string;
  errorCategory?: string;
  errorMessage?: string;
  cleanTraceback?: string;
  executionTimeMs: number;
}

export type PyodideStatusListener = (status: 'loading' | 'ready' | 'error', message: string) => void;

export class PyodideClient {
  private static instance: PyodideClient | null = null;
  private worker: Worker | null = null;
  private isReady = false;
  private isLoading = false;
  private isExecuting = false;
  private statusListeners: Set<PyodideStatusListener> = new Set();
  private pendingJob: {
    id: string;
    resolve: (res: PyodideRunResult) => void;
    reject: (err: unknown) => void;
    options: PyodideRunOptions;
    startTime: number;
    timer: NodeJS.Timeout | null;
  } | null = null;

  public static getInstance(): PyodideClient {
    if (!PyodideClient.instance) {
      PyodideClient.instance = new PyodideClient();
    }
    return PyodideClient.instance;
  }

  public subscribeStatus(listener: PyodideStatusListener): () => void {
    this.statusListeners.add(listener);
    if (this.isReady) {
      listener('ready', 'Môi trường Python sẵn sàng.');
    } else if (this.isLoading) {
      listener('loading', 'Đang tải môi trường Python WebAssembly...');
    }
    return () => this.statusListeners.delete(listener);
  }

  private notifyStatus(status: 'loading' | 'ready' | 'error', message: string) {
    this.statusListeners.forEach((listener) => listener(status, message));
  }

  public init(): void {
    if (typeof window === 'undefined') return;
    if (this.worker) return;

    this.isLoading = true;
    this.notifyStatus('loading', 'Đang tải môi trường Python WebAssembly...');

    try {
      this.worker = new Worker('/workers/pyodide.worker.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = (err) => {
        console.error('[Pyodide Worker Error]', err);
        this.notifyStatus('error', 'Lỗi khởi tạo Web Worker: ' + (err.message || String(err)));
      };

      this.worker.postMessage({ type: 'INIT' });
    } catch (err) {
      this.isLoading = false;
      this.notifyStatus('error', 'Trình duyệt không hỗ trợ Web Worker: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const data = event.data;
    if (!data) return;

    switch (data.type) {
      case 'STATUS':
        if (data.status === 'ready') {
          this.isReady = true;
          this.isLoading = false;
        } else if (data.status === 'error') {
          this.isReady = false;
          this.isLoading = false;
        }
        this.notifyStatus(data.status, data.message);
        break;

      case 'STDOUT':
        if (this.pendingJob && this.pendingJob.options.onStdout) {
          this.pendingJob.options.onStdout(data.text);
        }
        break;

      case 'STDERR':
        if (this.pendingJob && this.pendingJob.options.onStderr) {
          this.pendingJob.options.onStderr(data.text);
        }
        break;

      case 'SUCCESS':
        if (this.pendingJob && this.pendingJob.id === data.jobId) {
          if (this.pendingJob.timer) clearTimeout(this.pendingJob.timer);
          const resolve = this.pendingJob.resolve;
          this.pendingJob = null;
          this.isExecuting = false;
          resolve({
            status: 'completed',
            stdout: data.stdout || '',
            stderr: data.stderr || '',
            executionTimeMs: data.executionTimeMs || 0,
          });
        }
        break;

      case 'ERROR':
        if (this.pendingJob && this.pendingJob.id === data.jobId) {
          if (this.pendingJob.timer) clearTimeout(this.pendingJob.timer);
          const resolve = this.pendingJob.resolve;
          this.pendingJob = null;
          this.isExecuting = false;
          resolve({
            status: 'error',
            stdout: data.stdout || '',
            stderr: data.stderr || '',
            errorCategory: data.errorCategory || 'RuntimeError',
            errorMessage: data.rawError || '',
            cleanTraceback: data.cleanTraceback || data.rawError,
            executionTimeMs: data.executionTimeMs || 0,
          });
        }
        break;

      default:
        break;
    }
  }

  public async runCode(options: PyodideRunOptions): Promise<PyodideRunResult> {
    if (typeof window === 'undefined') {
      throw new Error('Pyodide can only execute in browser environment.');
    }

    if (!this.worker) {
      this.init();
    }

    if (this.isExecuting) {
      throw new Error('Một chương trình Python khác đang thực thi. Vui lòng đợi.');
    }

    this.isExecuting = true;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timeoutMs = options.timeoutMs ?? 5000;

    return new Promise<PyodideRunResult>((resolve, reject) => {
      // Set Watchdog Timer to catch infinite loops (e.g. while True:)
      const timer = setTimeout(() => {
        if (this.pendingJob && this.pendingJob.id === jobId) {
          this.terminateAndRecover('Chương trình chạy quá thời gian cho phép (' + (timeoutMs / 1000) + 's) - Nghi vấn vòng lặp vô tận (Time Limit Exceeded).');
          resolve({
            status: 'timeout',
            stdout: '',
            stderr: 'TimeLimitExceeded: Thực thi bị hủy sau ' + timeoutMs + 'ms do vượt quá thời gian cho phép.',
            errorCategory: 'TimeLimitExceeded',
            errorMessage: 'Time Limit Exceeded',
            cleanTraceback: 'TimeLimitExceeded: Chương trình chạy quá ' + (timeoutMs / 1000) + ' giây. Có thể do vòng lặp vô hạn (while True) hoặc xử lý quá tải.',
            executionTimeMs: timeoutMs,
          });
        }
      }, timeoutMs);

      this.pendingJob = {
        id: jobId,
        resolve,
        reject,
        options,
        startTime: Date.now(),
        timer,
      };

      this.worker?.postMessage({
        type: 'RUN',
        jobId,
        code: options.code,
        stdin: options.stdin || '',
      });
    });
  }

  // Terminate hung worker and spawn replacement worker
  public terminateAndRecover(reason: string): void {
    if (this.pendingJob?.timer) {
      clearTimeout(this.pendingJob.timer);
    }
    this.pendingJob = null;
    this.isExecuting = false;

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.isReady = false;
    this.notifyStatus('error', reason);

    // Automatically spawn fresh worker
    setTimeout(() => {
      this.init();
    }, 100);
  }

  public resetScope(): void {
    if (this.worker && this.isReady) {
      this.worker.postMessage({ type: 'RESET' });
    }
  }

  public destroy(): void {
    if (this.pendingJob?.timer) {
      clearTimeout(this.pendingJob.timer);
    }
    this.pendingJob = null;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isReady = false;
    this.isLoading = false;
    this.isExecuting = false;
  }
}
