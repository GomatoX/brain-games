// Test-only shim for the Next.js `server-only` marker module.
// In production, Next resolves `server-only` to a module that throws if
// imported from a client component. In vitest there's no such distinction,
// so this empty shim lets server modules be imported in tests.
export {}
