// CodeCoBUG Dedicated Pyodide Execution Worker
/* eslint-disable no-restricted-globals */

let pyodideInstance = null;
let isInitializing = false;
let initPromise = null;

// Clean error traceback by removing internal Pyodide frames
function sanitizeTraceback(rawTraceback) {
  if (!rawTraceback) return '';
  const lines = rawTraceback.split('\n');
  const filtered = [];
  let skipInternal = false;

  for (const line of lines) {
    if (line.includes('_pyodide') || line.includes('eval_code_async') || line.includes('CodeRunner')) {
      skipInternal = true;
      continue;
    }
    if (line.includes('File "<exec>"') || line.includes('SyntaxError') || line.includes('Error:') || line.includes('Exception:')) {
      skipInternal = false;
    }
    if (!skipInternal) {
      filtered.push(line);
    }
  }

  const result = filtered.join('\n').trim();
  return result || rawTraceback;
}

// Initialize Pyodide WebAssembly
async function initializePyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (initPromise) return initPromise;

  isInitializing = true;
  self.postMessage({ type: 'STATUS', status: 'loading', message: 'Đang tải môi trường Python WebAssembly...' });

  initPromise = (async () => {
    try {
      // Try loading from local public directory first
      if (typeof importScripts === 'function') {
        try {
          importScripts('/pyodide/pyodide.js');
        } catch {
          // Fallback to CDN if local script load fails
          importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.8/full/pyodide.js');
        }
      }

      if (typeof self.loadPyodide !== 'function') {
        throw new Error('loadPyodide is not defined. Failed to load pyodide.js.');
      }

      const pyodide = await self.loadPyodide({
        indexURL: '/pyodide/',
      });

      // Prepare isolated execution environment
      pyodide.runPython(`
import sys
import io

class CleanExecutionScope:
    def __init__(self):
        self.scope = {}
    
    def reset(self):
        self.scope.clear()

_scope_manager = CleanExecutionScope()
`);

      pyodideInstance = pyodide;
      isInitializing = false;
      self.postMessage({ type: 'STATUS', status: 'ready', message: 'Môi trường Python sẵn sàng.' });
      return pyodide;
    } catch (err) {
      isInitializing = false;
      initPromise = null;
      self.postMessage({
        type: 'STATUS',
        status: 'error',
        message: 'Không thể khởi tạo Pyodide: ' + (err.message || String(err)),
      });
      throw err;
    }
  })();

  return initPromise;
}

// Execute Python Code
async function runPythonCode(jobId, code, inputString = '') {
  const startTime = Date.now();
  let stdoutAccumulator = '';
  let stderrAccumulator = '';

  try {
    const pyodide = await initializePyodide();

    // Setup stdout capture
    pyodide.setStdout({
      batched: (text) => {
        stdoutAccumulator += text + '\n';
        self.postMessage({ type: 'STDOUT', jobId, text });
      },
    });

    // Setup stderr capture
    pyodide.setStderr({
      batched: (text) => {
        stderrAccumulator += text + '\n';
        self.postMessage({ type: 'STDERR', jobId, text });
      },
    });

    // Setup stdin queue from inputString
    const inputLines = inputString.length > 0 ? inputString.split(/\r?\n/) : [];
    let inputIndex = 0;

    pyodide.setStdin({
      stdin: () => {
        if (inputIndex < inputLines.length) {
          const val = inputLines[inputIndex++];
          return val;
        }
        return ''; // Return empty string for EOF
      },
    });

    // Reset clean global namespace to prevent variable leakage between runs
    pyodide.runPython('_scope_manager.reset()');

    // Run Python asynchronously
    await pyodide.runPythonAsync(code, {
      globals: pyodide.globals.get('_scope_manager').scope,
    });

    const elapsed = Date.now() - startTime;
    self.postMessage({
      type: 'SUCCESS',
      jobId,
      stdout: stdoutAccumulator,
      stderr: stderrAccumulator,
      executionTimeMs: elapsed,
    });
  } catch (err) {
    const elapsed = Date.now() - startTime;
    const rawError = err.message || String(err);
    const cleanTraceback = sanitizeTraceback(rawError);

    let errorCategory = 'RuntimeError';
    if (rawError.includes('SyntaxError')) errorCategory = 'SyntaxError';
    else if (rawError.includes('ZeroDivisionError')) errorCategory = 'ZeroDivisionError';
    else if (rawError.includes('NameError')) errorCategory = 'NameError';
    else if (rawError.includes('TypeError')) errorCategory = 'TypeError';
    else if (rawError.includes('IndexError')) errorCategory = 'IndexError';
    else if (rawError.includes('ValueError')) errorCategory = 'ValueError';

    self.postMessage({
      type: 'ERROR',
      jobId,
      errorCategory,
      rawError,
      cleanTraceback,
      stdout: stdoutAccumulator,
      stderr: stderrAccumulator,
      executionTimeMs: elapsed,
    });
  }
}

// Worker message router
self.onmessage = async (event) => {
  const { type, jobId, code, stdin } = event.data || {};

  switch (type) {
    case 'INIT':
      try {
        await initializePyodide();
      } catch {
        // handled in initializePyodide
      }
      break;

    case 'RUN':
      await runPythonCode(jobId, code, stdin);
      break;

    case 'RESET':
      if (pyodideInstance) {
        try {
          pyodideInstance.runPython('_scope_manager.reset()');
          self.postMessage({ type: 'RESET_COMPLETE' });
        } catch {
          // ignore
        }
      }
      break;

    default:
      break;
  }
};
