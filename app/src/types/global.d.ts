// Project-owned ambient type declarations.
//
// TypeScript 6.0 enabled `noUncheckedSideEffectImports` by default, which
// makes `import "./globals.css"` a type error unless a module declaration
// exists. Next's global.d.ts only declares `*.module.css`, not bare `*.css`.
declare module "*.css"
