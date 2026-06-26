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

3. FOLDER CONVENTION (apps/web/src/app/):

- `core/` — services, guards, interceptors, tokens, models. App infrastructure only.
- `shared/` — dumb, reusable standalone components and pipes (no business logic).
- `shared/` MUST NOT import from `features/`.
- `features/` — page-level smart components. Each feature is isolated.
- Avoid cross-feature coupling — features communicate via services in `core/`, never via direct imports.

4. SECURITY RULES (frontend-specific):

- NEVER query the `participants` table directly for SELECT — always use `participants_public` view.
- NEVER implement draw logic on the frontend — it belongs exclusively in the `perform-draw` Edge Function.
- NEVER expose `drawn_participant_id` in any component or service. Use `MyDrawResult` from the `get_my_draw` RPC.
- NEVER read `admin_token` from query params or URL — only from the route param `:adminToken` after the `adminTokenGuard` validates it.

5. RESOURCE API:

- For data fetching in page components, prefer `resource()` over manual `signal()` + `isLoading` + `error` boilerplate.
- Use `resource()` with `reload()` after mutations (add/delete/draw).
- `httpResource()` is acceptable for simple GET-only cases without post-fetch transformation.
