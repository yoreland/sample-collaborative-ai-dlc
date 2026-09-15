import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { readdirSync, existsSync, readFileSync } from 'node:fs';

// The fork-local bmad dataset (lambda/seed-blocks/bmad/index.js) imports its
// markdown files as text via `import x from './...md' with { type: 'text' }`.
// esbuild inlines those at bundle time, but Vite (which vitest uses to
// transform test modules) does not handle `.md` text imports, so it tries to
// parse the markdown as JS and fails. This plugin transforms any `.md` module
// into an ESM string default export, matching esbuild's `type: 'text'`
// behavior, so the seed-blocks test can import the bmad dataset directly. It is
// applied per-project (each vitest project is its own Vite pipeline).
const markdownAsText = () => ({
  name: 'markdown-as-text',
  enforce: 'pre',
  transform(_code, id) {
    const path = id.split('?')[0];
    if (!path.endsWith('.md')) return null;
    return { code: `export default ${JSON.stringify(readFileSync(path, 'utf8'))};`, map: null };
  },
});

const lambdaRoot = new URL('./lambda/', import.meta.url);
const lambdas = readdirSync(fileURLToPath(lambdaRoot)).filter((name) =>
  existsSync(new URL(`${name}/test`, lambdaRoot)),
);

const setupFiles = [fileURLToPath(new URL('./test/setup.js', import.meta.url))];
// One gremlin-server + one DynamoDB Local testcontainer are started for the whole
// vitest run and shared across every project. Per-file PartitionStrategy isolates
// graph writes; per-suite table names isolate DynamoDB.
const globalSetup = [
  fileURLToPath(new URL('./test/gremlin-setup.js', import.meta.url)),
  fileURLToPath(new URL('./test/dynamodb-setup.js', import.meta.url)),
];

export default defineConfig({
  test: {
    projects: lambdas.map((name) => ({
      plugins: [markdownAsText()],
      test: {
        name,
        root: fileURLToPath(new URL(name, lambdaRoot)),
        include: ['test/**/*.test.js'],
        setupFiles,
      },
    })),
    globalSetup,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['lambda/**/*.js'],
      exclude: ['lambda/**/test/**', 'lambda/**/*.config.js', 'lambda/**/node_modules/**'],
      all: true,
    },
  },
});
