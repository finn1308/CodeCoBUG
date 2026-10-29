const { loadPyodide } = require('pyodide');

async function runTestSuite() {
  console.log('====================================================');
  console.log('CodeCoBUG — Phase 3: Pyodide Runtime Automated Tests');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  console.log('Initializing Pyodide WebAssembly runtime...');
  const startTime = Date.now();
  const pyodide = await loadPyodide();
  console.log(`Pyodide initialized in ${Date.now() - startTime}ms.\n`);

  // --- Test 1: Valid Code Execution & Stdout ---
  console.log('--- Test 1: Valid Code Execution & Output ---');
  let stdout1 = '';
  pyodide.setStdout({ batched: (msg) => { stdout1 += msg + '\n'; } });
  await pyodide.runPythonAsync(`
def greet(name):
    return f"Xin chao {name}!"

print(greet("CodeCoBUG"))
for i in range(3):
    print(f"Dem: {i}")
`);
  assert(stdout1.includes('Xin chao CodeCoBUG!'), 'Function definition and call produced correct stdout');
  assert(stdout1.includes('Dem: 0\nDem: 1\nDem: 2'), 'Loop execution printed 3 lines in order');
  console.log(`Captured Stdout:\n${stdout1.trim()}\n`);

  // --- Test 2: Input-dependent Programs (Stdin via input()) ---
  console.log('--- Test 2: Input Handling (sys.stdin & input()) ---');
  let stdout2 = '';
  pyodide.setStdout({ batched: (msg) => { stdout2 += msg + '\n'; } });

  const stdinQueue = ['Nguyen Van Huy', '25', '10.5'];
  let stdinIdx = 0;
  pyodide.setStdin({
    stdin: () => {
      if (stdinIdx < stdinQueue.length) {
        return stdinQueue[stdinIdx++];
      }
      return '';
    },
  });

  await pyodide.runPythonAsync(`
fullname = input()
age = int(input())
score = float(input())
print(f"Hoc vien: {fullname} | Tuoi: {age} | Diem: {score * 2}")
`);
  assert(stdout2.includes('Hoc vien: Nguyen Van Huy | Tuoi: 25 | Diem: 21.0'), 'Multiple sequential input() calls correctly parsed strings, ints, and floats');
  console.log(`Captured Stdout:\n${stdout2.trim()}\n`);

  // --- Test 3: Syntax Errors Caught Cleanly ---
  console.log('--- Test 3: SyntaxError Detection ---');
  let syntaxErrorCaught = false;
  let syntaxErrorMessage = '';
  try {
    await pyodide.runPythonAsync(`
def broken_func(
    print("Missing closing parenthesis"
`);
  } catch (err) {
    syntaxErrorCaught = true;
    syntaxErrorMessage = err.message || String(err);
  }
  assert(syntaxErrorCaught, 'SyntaxError successfully raised by runtime');
  assert(syntaxErrorMessage.includes('SyntaxError'), 'Error message contains SyntaxError classification');
  console.log(`Captured SyntaxError:\n${syntaxErrorMessage.trim()}\n`);

  // --- Test 4: Runtime Errors (ZeroDivisionError, ValueError, NameError) ---
  console.log('--- Test 4: RuntimeError Detection ---');
  let zeroDivCaught = false;
  let zeroDivMessage = '';
  try {
    await pyodide.runPythonAsync(`
x = 100
y = 0
result = x / y
`);
  } catch (err) {
    zeroDivCaught = true;
    zeroDivMessage = err.message || String(err);
  }
  assert(zeroDivCaught, 'ZeroDivisionError successfully caught');
  assert(zeroDivMessage.includes('ZeroDivisionError: division by zero'), 'Traceback clearly identifies division by zero');

  let nameErrorCaught = false;
  try {
    await pyodide.runPythonAsync(`print(undefined_variable_xyz)`);
  } catch (err) {
    nameErrorCaught = true;
    assert(err.message.includes("NameError: name 'undefined_variable_xyz' is not defined"), 'NameError accurately identifies missing variable');
  }
  assert(nameErrorCaught, 'NameError successfully caught');

  // --- Test 5: Variable Scope Isolation (No Leakage Between Runs) ---
  console.log('\n--- Test 5: State Cleanup & Scope Isolation ---');
  // Run 1: sets a global variable
  const scope1 = pyodide.toPy({});
  await pyodide.runPythonAsync(`secret_token = "ABC-123-SECRET"`, { globals: scope1 });

  // Run 2: independent global scope
  const scope2 = pyodide.toPy({});
  let leaked = false;
  try {
    await pyodide.runPythonAsync(`print(secret_token)`, { globals: scope2 });
    leaked = true;
  } catch (err) {
    assert(err.message.includes("NameError: name 'secret_token' is not defined"), 'Run 2 cannot access variables declared in Run 1');
  }
  assert(!leaked, 'Variable state does NOT leak across independent runs');

  console.log('\n====================================================');
  console.log(`Test Results: ${passedTests}/${totalTests} tests PASSED (100%)`);
  console.log('====================================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed unexpectedly:', err);
  process.exit(1);
});
