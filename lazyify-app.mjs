// Usage (from your project root):  node lazyify-app.mjs src/App.tsx
// Converts every static page import in App into React.lazy, removes the fake 1s loader,
// and wraps <Routes> in <Suspense>. A backup is saved as App.tsx.bak.
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('Usage: node lazyify-app.mjs <path to App file>'); process.exit(1); }

let src = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file + '.bak', src);

// 1) static page/component imports -> lazy (keeps PageTitle eager since it is tiny and used everywhere)
let count = 0;
src = src.replace(
  /^import\s+(\w+)\s+from\s+'(\.\/(?:pages|components)\/[^']+)';?[ \t]*$/gm,
  (m, name, path) => {
    if (name === 'PageTitle') return m;
    count++;
    return `const ${name} = lazy(() => import('${path}'));`;
  }
);

// 2) react import
src = src.replace(
  /import\s*\{([^}]*)\}\s*from\s*'react';/,
  (m, inner) => {
    const names = new Set(inner.split(',').map((s) => s.trim()).filter(Boolean));
    names.add('lazy'); names.add('Suspense');
    return `import { ${[...names].join(', ')} } from 'react';`;
  }
);

// 3) remove the fake loading delay
src = src.replace(/const \[loading, setLoading\] = useState\(true\);\s*/, '');
src = src.replace(/useEffect\(\(\) => \{\s*setTimeout\(\(\) => setLoading\(false\), \d+\);\s*\}, \[\]\);\s*/, '');
src = src.replace(/return loading \? \(\s*<Loader \/>\s*\) : \(/, 'return (');

// 4) Suspense around Routes
src = src.replace('<Routes>', '<Suspense fallback={<Loader />}>\n      <Routes>');
src = src.replace('</Routes>', '</Routes>\n      </Suspense>');

fs.writeFileSync(file, src);

