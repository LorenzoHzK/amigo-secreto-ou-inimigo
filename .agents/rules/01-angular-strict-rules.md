---
trigger: glob
globs: apps/web/src/**/*
---

# 01 - ANGULAR 21 & TAILWIND STRICT RULES

Activation Mode: Glob
Glob Pattern: apps/web/src/\*_/_

When acting in the front-end ecosystem of this project, strictly obey:

1. ANGULAR PARADIGM:

- STANDALONE FIRST: IT IS STRICTLY FORBIDDEN to use or suggest generic NgModules or SharedModule.
- CONTROL FLOW: ALWAYS use modern syntax: @if, @for, @switch. Forbidden: *ngIf, *ngFor, \*ngSwitch.
- REACTIVITY: Prioritize Signals: signal, computed, effect when appropriate.
- DEPENDENCY INJECTION: Prefer inject() over constructor injection.
- TYPING: Strict TypeScript. The use of any is prohibited.

2. STYLING - Tailwind v4:

- CSS-first architecture.
- PROHIBITED: creating custom .css or .scss files for isolated components.
- Use Tailwind utility classes directly in HTML.
- The only allowed exception is the global styles.css file.

3. FEATURE-SLICED DESIGN - FSD:

- core/: bootstrapping, providers, interceptors and app infrastructure.
- shared/: dumb reusable components only.
- shared/ MUST NOT import from features/.
- features/: domain isolated code.
- Avoid cross-feature coupling.
