# Clean Architecture Coding Guidelines

**Status:** Normative specification
**Audience:** Human engineers and AI coding assistants
**Scope:** Any TypeScript/web project (Next.js, NestJS, Express, serverless, CLI, etc.) that adopts this architecture

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119.

Code samples are taken from a reference Next.js Todo application. The reference project uses Drizzle (SQLite/Turso), Lucia (auth), Sentry (monitoring), Zod (validation), Vitest (tests), `@evyweb/ioctopus` (IoC container) and `eslint-plugin-boundaries`. None of these tools is mandatory. The **rules** are mandatory; the **tools** are illustrative.

---

## Table of Contents

1. [Purpose and Goals](#1-purpose-and-goals)
2. [The Layer Model (Clean / Onion / Hexagonal)](#2-the-layer-model-clean--onion--hexagonal)
3. [The Dependency Rule and Dependency Inversion (DIP)](#3-the-dependency-rule-and-dependency-inversion-dip)
4. [Package by Layer: Directory Structure and Naming](#4-package-by-layer-directory-structure-and-naming)
5. [Layer Specifications](#5-layer-specifications)
   - 5.1 [Entities](#51-entities-srcentities)
   - 5.2 [Application (Use Cases + Ports)](#52-application-srcapplication)
   - 5.3 [Infrastructure (Adapters)](#53-infrastructure-srcinfrastructure)
   - 5.4 [Interface Adapters (Controllers + Presenters)](#54-interface-adapters-srcinterface-adapters)
   - 5.5 [Frameworks & Drivers](#55-frameworks--drivers-app-and-friends)
6. [Composition Root and Inversion of Control (`di/`)](#6-composition-root-and-inversion-of-control-di)
7. [Higher-Order Function Injection (Currying)](#7-higher-order-function-injection-currying)
8. [Single Responsibility: Use Cases vs. Controllers](#8-single-responsibility-use-cases-vs-controllers)
9. [The Presenter Pattern](#9-the-presenter-pattern)
10. [Error Handling Across Boundaries](#10-error-handling-across-boundaries)
11. [Cross-Cutting Concerns: Instrumentation, Crash Reporting, Transactions](#11-cross-cutting-concerns-instrumentation-crash-reporting-transactions)
12. [Architecture-as-Code: Linter Boundaries](#12-architecture-as-code-linter-boundaries)
13. [Testing: Test Doubles and In-Memory Mocks](#13-testing-test-doubles-and-in-memory-mocks)
14. [Recipe: Adding a Feature (Inside-Out Workflow)](#14-recipe-adding-a-feature-inside-out-workflow)
15. [Quick Reference Checklists](#15-quick-reference-checklists)
16. [Glossary](#16-glossary)

---

## 1. Purpose and Goals

This architecture exists so that the core of an application is:

| Goal | Meaning |
|---|---|
| **Independent of frameworks** | Business logic does not import Next.js, NestJS, Express, React, etc. The framework is a delivery mechanism, not the application. |
| **Independent of UI** | The same core can be driven by a web UI, a REST handler, a CLI, a queue consumer, or a webhook without changes. |
| **Independent of the database** | Postgres, SQLite, Mongo, an HTTP API, or an in-memory array are interchangeable behind a repository port. |
| **Independent of external agencies** | Auth providers, email services, payment SDKs, monitoring vendors are hidden behind service ports. |
| **Testable** | Every core operation can be unit-tested with zero I/O, zero network, and zero running database. |

The architecture achieves these goals by prescribing **a dependency hierarchy**: code is placed into layers, and dependencies are only allowed to point *inward*.

---

## 2. The Layer Model (Clean / Onion / Hexagonal)

Clean Architecture (Robert C. Martin, 2012) consolidates Hexagonal Architecture (Ports & Adapters), Onion Architecture, and Screaming Architecture into a single model of concentric layers. The reference project uses five layers:

```
┌──────────────────────────────────────────────────────────────┐
│  FRAMEWORKS & DRIVERS  (app/, API routes, server actions,     │
│  CLI entry points, webhooks, lambdas, UI components)          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  INTERFACE ADAPTERS  (controllers, presenters)          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  APPLICATION  (use cases + repository/service     │  │  │
│  │  │  interfaces a.k.a. PORTS)                         │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  ENTITIES  (models, domain errors)          │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  INFRASTRUCTURE  (repositories, services = ADAPTERS)          │
│  Sits on the OUTSIDE, implements APPLICATION ports.           │
└──────────────────────────────────────────────────────────────┘
```

A flattened view of the same model, which is often easier to reason about:

```
   Frameworks & Drivers ──► Interface Adapters ──► Application ──► Entities
                                                        ▲
                                                        │ implements ports
                                                  Infrastructure
```

### Rules

- **R2.1** Every source file **MUST** belong to exactly one layer.
- **R2.2** The Entities and Application layers together form the **core**. The core **MUST NOT** contain any import from a framework, ORM, SDK, HTTP client, or UI library.
- **R2.3** Infrastructure is an *outer* layer even though it is drawn at the bottom of the flattened diagram. It **MUST** depend on Application ports; Application **MUST NOT** depend on Infrastructure.
- **R2.4** The Composition Root (`di/`) is outside all layers and is the only place allowed to know about every layer at once (see §6).

---

## 3. The Dependency Rule and Dependency Inversion (DIP)

### 3.1 The Dependency Rule

> Source code dependencies **MUST** point only inward. Nothing in an inner layer may know anything about an outer layer.

Concretely, the allowed import graph is:

| From layer | MAY import from |
|---|---|
| `entities` | `entities` |
| `application/repositories` (ports) | `entities` |
| `application/services` (ports) | `entities` |
| `application/use-cases` | `entities`, `application/repositories`, `application/services` |
| `interface-adapters/controllers` | `entities`, `application/*` (use cases and ports) |
| `infrastructure` | `entities`, `application/repositories`, `application/services` (ports only, never use cases) |
| `app/` (frameworks) | `entities` (errors + model types), `di/` |
| `di/` | everything except `app/` |

Anything not in the table is forbidden and is enforced mechanically (§12).

### 3.2 Dependency Inversion Principle

The Application layer needs to persist data and talk to third parties, but it is not allowed to import the database. The solution is DIP:

- The **inner** layer declares an interface (a **port**) describing what it needs.
- The **outer** layer implements that interface (an **adapter**).
- The Composition Root binds the adapter to the port at runtime.

**Port (declared in Application):**

```ts
// src/application/repositories/todos.repository.interface.ts
import type { Todo, TodoInsert } from '@/src/entities/models/todo';

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: any): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(id: number, input: Partial<TodoInsert>, tx?: any): Promise<Todo>;
  deleteTodo(id: number, tx?: any): Promise<void>;
}
```

**Adapter (implemented in Infrastructure):**

```ts
// src/infrastructure/repositories/todos.repository.ts
import { eq } from 'drizzle-orm';
import { db, Transaction } from '@/drizzle';
import { todos } from '@/drizzle/schema';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { TodoInsert, Todo } from '@/src/entities/models/todo';

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? db;
    // ... drizzle query, throws DatabaseOperationError on failure
  }
  // ...
}
```

Note the direction: the adapter imports the port. The port never imports the adapter.

### Rules

- **R3.1** Every external capability (database table access, auth, email, payments, monitoring, transactions, file storage, queues) **MUST** be exposed to the core through a port declared in `src/application/`.
- **R3.2** Ports **MUST** be TypeScript `interface`s and **MUST** be named with an `I` prefix (`ITodosRepository`, `IAuthenticationService`).
- **R3.3** Port method signatures **MUST** only use types from `entities` or primitives. They **MUST NOT** expose ORM row types, SDK types, or framework types. (If a transaction handle must cross the boundary, define an abstract type in `entities`, e.g. `ITransaction { rollback(): void }`.)
- **R3.4** Use cases and controllers **MUST** type their dependencies as ports, never as concrete adapter classes.
- **R3.5** Use cases and controllers **MUST NOT** instantiate adapters (`new TodosRepository()`) and **MUST NOT** call the container directly. Dependencies are received as arguments (§7).

---

## 4. Package by Layer: Directory Structure and Naming

The directory tree is organized **horizontally by architectural role**, not by feature. This makes the layer of any file evident from its path, which is what allows linter enforcement.

```
<repo-root>/
├── app/                              # FRAMEWORKS & DRIVERS (Next.js here; could be routes/, handlers/, cli/)
│   ├── actions.ts                    #   server actions = entry points
│   ├── page.tsx                      #   server components = entry points
│   ├── (auth)/actions.ts
│   └── _components/                  #   UI
├── di/                               # COMPOSITION ROOT
│   ├── container.ts                  #   builds container, exports getInjection()
│   ├── types.ts                      #   DI_SYMBOLS + DI_RETURN_TYPES
│   └── modules/
│       ├── authentication.module.ts
│       ├── database.module.ts
│       ├── monitoring.module.ts
│       ├── todos.module.ts
│       └── users.module.ts
├── drizzle/                          # DB driver config, schema, migrations (infrastructure detail)
├── src/                              # THE APPLICATION CORE + ADAPTERS
│   ├── entities/
│   │   ├── models/
│   │   │   ├── todo.ts
│   │   │   ├── user.ts
│   │   │   ├── session.ts
│   │   │   ├── cookie.ts
│   │   │   └── transaction.interface.ts
│   │   └── errors/
│   │       ├── auth.ts
│   │       └── common.ts
│   ├── application/
│   │   ├── repositories/
│   │   │   ├── todos.repository.interface.ts
│   │   │   └── users.repository.interface.ts
│   │   ├── services/
│   │   │   ├── authentication.service.interface.ts
│   │   │   ├── crash-reporter.service.interface.ts
│   │   │   ├── instrumentation.service.interface.ts
│   │   │   └── transaction-manager.service.interface.ts
│   │   └── use-cases/
│   │       ├── auth/
│   │       │   ├── sign-in.use-case.ts
│   │       │   ├── sign-out.use-case.ts
│   │       │   └── sign-up.use-case.ts
│   │       └── todos/
│   │           ├── create-todo.use-case.ts
│   │           ├── delete-todo.use-case.ts
│   │           ├── get-todos-for-user.use-case.ts
│   │           └── toggle-todo.use-case.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── todos.repository.ts
│   │   │   ├── todos.repository.mock.ts
│   │   │   ├── users.repository.ts
│   │   │   └── users.repository.mock.ts
│   │   └── services/
│   │       ├── authentication.service.ts
│   │       ├── authentication.service.mock.ts
│   │       ├── crash-reporter.service.ts
│   │       ├── crash-reporter.service.mock.ts
│   │       ├── instrumentation.service.ts
│   │       ├── instrumentation.service.mock.ts
│   │       ├── transaction-manager.service.ts
│   │       └── transaction-manager.service.mock.ts
│   └── interface-adapters/
│       └── controllers/
│           ├── auth/
│           │   ├── sign-in.controller.ts
│           │   ├── sign-out.controller.ts
│           │   └── sign-up.controller.ts
│           └── todos/
│               ├── bulk-update.controller.ts
│               ├── create-todo.controller.ts
│               ├── get-todos-for-user.controller.ts
│               └── toggle-todo.controller.ts
└── tests/
    └── unit/                         # mirrors src/ one-to-one
        ├── application/use-cases/...
        └── interface-adapters/controllers/...
```

### Naming conventions

| Artifact | File name | Export |
|---|---|---|
| Model | `<noun>.ts` | `<noun>Schema`, `type <Noun>`, `type <Noun>Insert` / `Create<Noun>` |
| Domain error | grouped in `errors/<group>.ts` | `class <Name>Error extends Error` |
| Repository port | `<nouns>.repository.interface.ts` | `interface I<Nouns>Repository` |
| Service port | `<name>.service.interface.ts` | `interface I<Name>Service` |
| Use case | `<verb>-<noun>.use-case.ts` | `const <verb><Noun>UseCase`, `type I<Verb><Noun>UseCase` |
| Controller | `<verb>-<noun>.controller.ts` | `const <verb><Noun>Controller`, `type I<Verb><Noun>Controller` |
| Repository adapter | `<nouns>.repository.ts` | `class <Nouns>Repository implements I<Nouns>Repository` |
| Service adapter | `<name>.service.ts` | `class <Name>Service implements I<Name>Service` |
| Mock adapter | `<same>.mock.ts` | `class Mock<Same>` |
| DI module | `di/modules/<feature>.module.ts` | `function create<Feature>Module()` |
| Unit test | `tests/unit/<mirrored path>/<same>.test.ts` | — |

### Rules

- **R4.1** File names **MUST** be kebab-case and **MUST** carry a role suffix (`.use-case.ts`, `.controller.ts`, `.repository.ts`, `.service.ts`, `.interface.ts`, `.mock.ts`, `.module.ts`).
- **R4.2** Use cases and controllers **SHOULD** be grouped in a sub-folder per bounded feature (`todos/`, `auth/`).
- **R4.3** The `tests/unit/` tree **MUST** mirror the `src/` tree path-for-path.
- **R4.4** Imports **SHOULD** use an absolute alias rooted at the repository (`@/src/...`, `@/di/...`) so that boundary patterns are stable.
- **R4.5** A new top-level folder **MUST** be registered as a boundary element (§12) before code is placed in it; unknown files fail the lint.

---

## 5. Layer Specifications

### 5.1 Entities (`src/entities/`)

**Responsibility:** Enterprise-wide models and the vocabulary of errors the core can raise. Nothing else.

**Models** are defined as validation schemas plus inferred types. In TypeScript, a schema library replaces the class-with-invariants that other languages would need.

```ts
// src/entities/models/todo.ts
import { z } from 'zod';

export const selectTodoSchema = z.object({
  id: z.number(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.string(),
});
export type Todo = z.infer<typeof selectTodoSchema>;

export const insertTodoSchema = selectTodoSchema.pick({
  todo: true,
  userId: true,
  completed: true,
});
export type TodoInsert = z.infer<typeof insertTodoSchema>;
```

```ts
// src/entities/models/user.ts
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(31),
  password_hash: z.string().min(6).max(255),
});
export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
  .pick({ id: true, username: true })
  .merge(z.object({ password: z.string().min(6).max(255) }));
export type CreateUser = z.infer<typeof createUserSchema>;
```

**Errors** are plain subclasses of `Error`, one per semantic outcome:

```ts
// src/entities/errors/auth.ts
export class AuthenticationError extends Error {
  constructor(message: string, options?: ErrorOptions) { super(message, options); }
}
export class UnauthenticatedError extends Error { /* same shape */ }
export class UnauthorizedError extends Error { /* same shape */ }

// src/entities/errors/common.ts
export class DatabaseOperationError extends Error { /* same shape */ }
export class NotFoundError extends Error { /* same shape */ }
export class InputParseError extends Error { /* same shape */ }
```

#### Rules

- **R5.1.1** Entities **MUST** import only from `entities` and from pure, framework-free libraries (a schema library such as Zod is acceptable).
- **R5.1.2** Every model **MUST** export both a runtime schema and an inferred TypeScript type.
- **R5.1.3** Insert/create variants **SHOULD** be derived from the full schema with `pick`/`omit`/`merge`, not duplicated.
- **R5.1.4** Every distinct failure condition that an outer layer needs to react to differently **MUST** have its own error class in `entities/errors`.
- **R5.1.5** Error classes **MUST** accept `(message, options?: ErrorOptions)` so that the originating error can be attached as `cause`.
- **R5.1.6** Entities **MUST NOT** contain persistence concerns (table names, column mappings), transport concerns (HTTP status codes), or UI concerns.

---

### 5.2 Application (`src/application/`)

**Responsibility:** Application-specific business rules (use cases) and the ports the core needs from the outside world.

#### 5.2.1 Ports (`repositories/`, `services/`)

See §3.2. Repositories abstract *data*; services abstract *behavior provided by third parties* (auth, monitoring, transactions, email…).

```ts
// src/application/services/authentication.service.interface.ts
export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(sessionId: Session['id']): Promise<{ user: User; session: Session }>;
  validatePasswords(inputPassword: string, usersHashedPassword: string): Promise<boolean>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session['id']): Promise<{ blankCookie: Cookie }>;
}

// src/application/services/transaction-manager.service.interface.ts
export interface ITransactionManagerService {
  startTransaction<T>(clb: (tx: ITransaction) => Promise<T>, parent?: ITransaction): Promise<T>;
}
```

#### 5.2.2 Use Cases (`use-cases/`)

A use case is **one** business operation. It receives **pre-validated** input and a **known** user, performs **authorization** and **business-rule** checks, calls ports, and returns entity models.

```ts
// src/application/use-cases/todos/toggle-todo.use-case.ts
import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import type { Todo } from '@/src/entities/models/todo';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type IToggleTodoUseCase = ReturnType<typeof toggleTodoUseCase>;

export const toggleTodoUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
  (input: { todoId: number }, userId: string, tx?: ITransaction): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: 'toggleTodo Use Case', op: 'function' },
      async () => {
        const todo = await todosRepository.getTodo(input.todoId);

        if (!todo) {
          throw new NotFoundError('Todo does not exist');
        }
        if (todo.userId !== userId) {
          throw new UnauthorizedError('Cannot toggle todo. Reason: unauthorized');
        }

        return await todosRepository.updateTodo(todo.id, { completed: !todo.completed }, tx);
      }
    );
  };
```

#### Rules

- **R5.2.1** A use case **MUST** be a curried function `(deps) => (input, userId?, tx?) => Promise<Result>` (§7).
- **R5.2.2** A use case **MUST** perform exactly one business operation (§8).
- **R5.2.3** A use case **MUST NOT** perform authentication (session validation). It receives an already-verified `userId`.
- **R5.2.4** A use case **MUST** perform authorization (may *this* user do *this* operation on *this* resource?) and **MUST** throw `UnauthorizedError` on failure.
- **R5.2.5** A use case **MUST NOT** re-validate input shape (that is the controller's job). It **MAY** enforce *business* invariants on already-shaped data (e.g. minimum length policy) and **SHOULD** throw an entities error when they fail.
- **R5.2.6** A use case **MUST** return entity models (or primitives/composites thereof). It **MUST NOT** return presenter DTOs.
- **R5.2.7** A use case **MUST NOT** call another use case. Composition belongs to controllers (§8).
- **R5.2.8** A use case **MUST** accept an optional transaction handle as its last parameter when it writes to a repository, and forward it to the repository, so controllers can compose atomic operations.
- **R5.2.9** A use case **MUST** export its type as `export type I<Name>UseCase = ReturnType<typeof <name>UseCase>`.
- **R5.2.10** Use cases **MUST** import ports with `import type` where possible to make the "interface-only" dependency explicit.

---

### 5.3 Infrastructure (`src/infrastructure/`)

**Responsibility:** Concrete adapters that implement Application ports using real technology (ORM, SDK, HTTP). This is the only layer allowed to import databases, auth libraries, monitoring SDKs, etc.

Every adapter comes in **two flavors**: the real implementation and an in-memory mock (§13).

```ts
// src/infrastructure/services/crash-reporter.service.ts
import * as Sentry from '@sentry/nextjs';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class CrashReporterService implements ICrashReporterService {
  report(error: any): string {
    return Sentry.captureException(error);
  }
}

// src/infrastructure/services/crash-reporter.service.mock.ts
export class MockCrashReporterService implements ICrashReporterService {
  report(_: any): string { return 'errorId'; }
}
```

```ts
// src/infrastructure/services/transaction-manager.service.ts
import { db, Transaction } from '@/drizzle';
export class TransactionManagerService implements ITransactionManagerService {
  public startTransaction<T>(clb: (tx: Transaction) => Promise<T>, parent?: Transaction): Promise<T> {
    const invoker = parent ?? db;
    return invoker.transaction(clb);
  }
}
```

#### Rules

- **R5.3.1** Every adapter **MUST** be a class that `implements` exactly one Application port.
- **R5.3.2** Adapters **MUST NOT** contain business rules, authorization, or input validation. A repository "takes data, doesn't ask questions, stores it, returns it."
- **R5.3.3** Adapters **MUST** translate technology-specific errors into `entities` errors (`DatabaseOperationError`, `NotFoundError`, …) before rethrowing. Technology error types **MUST NOT** escape the Infrastructure layer.
- **R5.3.4** Adapters **MUST** report unexpected exceptions through the `ICrashReporterService` port, not by importing the monitoring SDK directly (the crash reporter adapter is the single exception, since it *is* the SDK wrapper).
- **R5.3.5** Adapters **MUST** accept their own dependencies (other ports) through the constructor and **MUST NOT** call the container.
- **R5.3.6** Adapters that write **MUST** accept an optional transaction handle and use it (`const invoker = tx ?? db`).
- **R5.3.7** Adapters **MUST NOT** import use cases or controllers.
- **R5.3.8** Every adapter **MUST** have a sibling `.mock.ts` (§13).

---

### 5.4 Interface Adapters (`src/interface-adapters/`)

**Responsibility:** Controllers are the *first touch point* of the core. They (1) authenticate, (2) validate and parse raw input, (3) orchestrate one or more use cases (optionally inside a transaction), and (4) run the result through a presenter.

```ts
// src/interface-adapters/controllers/todos/create-todo.controller.ts
import { z } from 'zod';
import { ICreateTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

function presenter(todos: Todo[], instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan(
    { name: 'createTodo Presenter', op: 'serialize' },
    () => todos.map((todo) => ({
      id: todo.id,
      todo: todo.todo,
      userId: todo.userId,
      completed: todo.completed,
    }))
  );
}

const inputSchema = z.object({ todo: z.string().min(1) });

export type ICreateTodoController = ReturnType<typeof createTodoController>;

export const createTodoController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    createTodoUseCase: ICreateTodoUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'createTodo Controller' },
      async () => {
        // 1. Authenticate
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to create a todo');
        }
        const { user } = await authenticationService.validateSession(sessionId);

        // 2. Validate & parse
        const { data, error: inputParseError } = inputSchema.safeParse(input);
        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        // 3. Orchestrate use cases (transactionally)
        const todosFromInput = data.todo.split(',').map((t) => t.trim());
        const todos = await instrumentationService.startSpan(
          { name: 'Create Todo Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await Promise.all(
                  todosFromInput.map((t) => createTodoUseCase({ todo: t }, user.id, tx))
                );
              } catch (err) {
                console.error('Rolling back!');
                tx.rollback();
              }
            })
        );

        // 4. Present
        return presenter(todos ?? [], instrumentationService);
      }
    );
  };
```

#### Rules

- **R5.4.1** A controller **MUST** be a curried function `(deps) => async (input, sessionId?) => Promise<DTO>` (§7).
- **R5.4.2** A controller **MUST** accept *untrusted* input typed as `Partial<z.infer<typeof inputSchema>>` (or `unknown`) and **MUST** validate it with a schema declared at the top of the same file.
- **R5.4.3** On validation failure a controller **MUST** throw `InputParseError` with the schema error attached as `cause`.
- **R5.4.4** Authentication (session validation) **MUST** happen in the controller, before input parsing, and **MUST** throw `UnauthenticatedError` when the session is missing or invalid. Authentication **MUST NOT** be delegated to the framework layer.
- **R5.4.5** Controllers are the **only** place where multiple use cases may be composed (§8).
- **R5.4.6** Controllers **MUST** own transaction boundaries when several writes must be atomic, using `ITransactionManagerService`.
- **R5.4.7** Every value returned by a controller **MUST** pass through a presenter (§9). Controllers **MUST NOT** return raw entity models.
- **R5.4.8** Controllers **MUST NOT** import from `infrastructure`, from any framework, or from `di/`.
- **R5.4.9** Controllers **MUST NOT** catch entities errors to convert them into UI messages; they let them propagate. Mapping errors to responses is the framework layer's job (§10).
- **R5.4.10** A controller **MUST** export its type as `export type I<Name>Controller = ReturnType<typeof <name>Controller>`.

---

### 5.5 Frameworks & Drivers (`app/` and friends)

**Responsibility:** Everything that *consumes* the core: HTTP handlers, server actions, server components, CLI commands, queue consumers, webhooks, cron jobs, UI. This layer adapts framework input to controller input and controller output/errors to framework output.

```ts
// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/config';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { getInjection } from '@/di/container';

export async function createTodo(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'createTodo',
    { recordResponse: true },
    async () => {
      try {
        const data = Object.fromEntries(formData.entries());
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        const createTodoController = getInjection('ICreateTodoController');
        await createTodoController(data, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a todo' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error: 'An error happened while creating a todo. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}
```

#### Rules

- **R5.5.1** Entry points **MUST** obtain controllers via `getInjection(...)` and **MUST NOT** import controllers, use cases, or infrastructure classes directly.
- **R5.5.2** Entry points **MAY** import from `entities` (error classes for `instanceof` checks, model types for props) and from `di/`. They **MUST NOT** import from `application`, `interface-adapters`, or `infrastructure`.
- **R5.5.3** Entry points **MUST** catch every entities error they can handle and translate it into a framework-appropriate response (message, status code, redirect).
- **R5.5.4** Unhandled errors **MUST** be reported via `ICrashReporterService` and converted into a generic, non-leaking message.
- **R5.5.5** Framework side effects (cookies, redirects, cache revalidation, response headers) **MUST** live here and **MUST NOT** appear in inner layers. Inner layers return *data* describing the side effect (e.g. a `Cookie` model); the framework layer applies it.
- **R5.5.6** Entry points **MUST NOT** perform authentication or business validation themselves; they only pass raw input and the session identifier to the controller.

---

## 6. Composition Root and Inversion of Control (`di/`)

All wiring happens in one place at the edge of the system: the **Composition Root**. It is the only code that knows which concrete adapter satisfies which port, and which use cases feed which controllers.

### 6.1 Symbol registry with type safety

```ts
// di/types.ts
export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),
  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),
  // Use Cases
  ICreateTodoUseCase: Symbol.for('ICreateTodoUseCase'),
  IToggleTodoUseCase: Symbol.for('IToggleTodoUseCase'),
  // ...
  // Controllers
  ICreateTodoController: Symbol.for('ICreateTodoController'),
  IToggleTodoController: Symbol.for('IToggleTodoController'),
  // ...
};

export interface DI_RETURN_TYPES {
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;
  ICreateTodoUseCase: ICreateTodoUseCase;
  IToggleTodoUseCase: IToggleTodoUseCase;
  ICreateTodoController: ICreateTodoController;
  IToggleTodoController: IToggleTodoController;
  // ...
}
```

### 6.2 Feature modules

```ts
// di/modules/todos.module.ts
import { createModule } from '@evyweb/ioctopus';
import { MockTodosRepository } from '@/src/infrastructure/repositories/todos.repository.mock';
import { TodosRepository } from '@/src/infrastructure/repositories/todos.repository';
import { createTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { createTodoController } from '@/src/interface-adapters/controllers/todos/create-todo.controller';
import { DI_SYMBOLS } from '@/di/types';

export function createTodosModule() {
  const todosModule = createModule();

  // Adapter: real vs. in-memory mock, selected by environment
  if (process.env.NODE_ENV === 'test') {
    todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(MockTodosRepository);
  } else {
    todosModule
      .bind(DI_SYMBOLS.ITodosRepository)
      .toClass(TodosRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  // Use case: curried function, deps listed in parameter order
  todosModule
    .bind(DI_SYMBOLS.ICreateTodoUseCase)
    .toHigherOrderFunction(createTodoUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ITodosRepository,
    ]);

  // Controller: same, receives the use case as a dependency
  todosModule
    .bind(DI_SYMBOLS.ICreateTodoController)
    .toHigherOrderFunction(createTodoController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.ICreateTodoUseCase,
    ]);

  return todosModule;
}
```

### 6.3 Container and resolver

```ts
// di/container.ts
import { createContainer } from '@evyweb/ioctopus';
import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol('MonitoringModule'), createMonitoringModule());
ApplicationContainer.load(Symbol('TransactionManagerModule'), createTransactionManagerModule());
ApplicationContainer.load(Symbol('AuthenticationModule'), createAuthenticationModule());
ApplicationContainer.load(Symbol('UsersModule'), createUsersModule());
ApplicationContainer.load(Symbol('TodosModule'), createTodosModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(symbol: K): DI_RETURN_TYPES[K] {
  const instrumentationService = ApplicationContainer.get<IInstrumentationService>(
    DI_SYMBOLS.IInstrumentationService
  );
  return instrumentationService.startSpan(
    { name: '(di) getInjection', op: 'function', attributes: { symbol: symbol.toString() } },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol])
  );
}
```

`getInjection('ICreateTodoController')` is fully typed: the string key is constrained to `DI_SYMBOLS`, and the return type is looked up in `DI_RETURN_TYPES`.

### Rules

- **R6.1** All bindings **MUST** live under `di/`. No other folder **MAY** import an IoC library.
- **R6.2** Every port, use case, and controller **MUST** have an entry in both `DI_SYMBOLS` and `DI_RETURN_TYPES`, keyed by the same `I`-prefixed name. Symbols **MUST** be created with `Symbol.for(<same name>)`.
- **R6.3** Bindings **MUST** be grouped into one module per feature (`todos`, `users`, `authentication`) or per cross-cutting concern (`monitoring`, `database`).
- **R6.4** Each adapter binding **MUST** branch on the test environment and bind the in-memory mock under test (§13).
- **R6.5** The dependency list passed to a binding **MUST** match the target function's/constructor's parameter order exactly.
- **R6.6** `getInjection` **MUST** be the only public API of the container, and it **MUST** only be called from the Frameworks & Drivers layer and from tests. Core layers **MUST NOT** call it.
- **R6.7** The container **SHOULD** prefer an IoC library that does not require decorators or reflection metadata, so the core stays decorator-free and runs on constrained runtimes (e.g. edge runtimes without the Reflect API). If a reflection-based container is chosen, the project **MUST** document the runtime restrictions it imposes.

---

## 7. Higher-Order Function Injection (Currying)

Use cases and controllers are **not** classes and **do not** use decorators. They are curried arrow functions:

```
(dependencies...) => (input, ...) => Promise<Result>
```

The outer function receives ports/use cases; the inner function is the actual operation. The container calls the outer function once with resolved dependencies and registers the returned inner function under the symbol.

```ts
export type ICreateTodoUseCase = ReturnType<typeof createTodoUseCase>;
//          ^ the *inner* function type, i.e. (input, userId, tx?) => Promise<Todo>

export const createTodoUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (input: { todo: string }, userId: string, tx?: any): Promise<Todo> => { /* ... */ };
```

Consumers (controllers, tests) only ever see the inner function, so they are unaware that injection happened at all.

### Why this pattern

| Benefit | Explanation |
|---|---|
| Framework-free core | No `@Injectable()`, no `reflect-metadata`, no container import in `src/`. |
| Trivially testable | `createTodoUseCase(mockInstrumentation, mockRepo)` in a test yields a ready function; no container needed if you prefer manual wiring. |
| Explicit dependencies | The signature *is* the dependency manifest. Nothing hidden. |
| Type inference | `ReturnType<typeof fn>` gives the consumer-facing type for free; no separate interface to maintain. |
| Portable | Works in any runtime, including edge/serverless where reflection APIs are missing. |

### Rules

- **R7.1** Use cases and controllers **MUST** be defined as curried arrow functions exported as `const`. They **MUST NOT** be classes and **MUST NOT** use decorators.
- **R7.2** The outer function **MUST** list dependencies as positional parameters typed as ports or use-case types. Order **SHOULD** be: cross-cutting services (instrumentation) → domain services → repositories → use cases.
- **R7.3** The inner function's first parameter **MUST** be the operation input. For use cases, the second parameter **MUST** be `userId` when the operation is user-scoped; an optional transaction **MUST** be last. For controllers, the second parameter **MUST** be `sessionId: string | undefined` when authentication is required.
- **R7.4** The exported type **MUST** be `ReturnType<typeof <fn>>`, named with the `I` prefix, and **MUST** be what `DI_RETURN_TYPES` references.
- **R7.5** Infrastructure adapters, by contrast, **MUST** be classes (constructor injection), because they hold external client state and implement an `interface`.
- **R7.6** The inner function **SHOULD NOT** close over anything other than its injected dependencies and module-level constants (e.g. the input schema).

---

## 8. Single Responsibility: Use Cases vs. Controllers

### 8.1 Use cases do one thing

`createTodoUseCase` creates a todo. It does not add it to a list, does not delete, does not update, does not publish. Adding a todo to a list is a *different* operation and therefore a *different* use case.

### 8.2 Controllers compose

The **order and combination** of use cases is itself core business logic. If it were left to the framework layer, every consumer (web, CLI, cron) would have to re-implement it—and could get it wrong. So composition lives in controllers, inside the core.

```ts
// src/interface-adapters/controllers/todos/bulk-update.controller.ts
export const bulkUpdateController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    toggleTodoUseCase: IToggleTodoUseCase,
    deleteTodoUseCase: IDeleteTodoUseCase
  ) =>
  async (input: z.infer<typeof inputSchema>, sessionId: string | undefined): Promise<void> => {
    // ...auth + parse...
    await transactionManagerService.startTransaction(async (mainTx) => {
      try {
        await Promise.all(dirty.map((t) => toggleTodoUseCase({ todoId: t }, user.id, mainTx)));
      } catch (err) {
        mainTx.rollback();
      }
      // nested transaction (savepoint) so delete failures don't undo toggles
      await transactionManagerService.startTransaction(async (deleteTx) => {
        try {
          await Promise.all(deleted.map((t) => deleteTodoUseCase({ todoId: t }, user.id, deleteTx)));
        } catch (err) {
          deleteTx.rollback();
        }
      }, mainTx);
    });
  };
```

### Rules

- **R8.1** A use case **MUST** encapsulate exactly one business operation with one reason to change.
- **R8.2** A use case **MUST NOT** invoke another use case. If two operations always happen together, a controller composes them.
- **R8.3** Even when an operation currently needs a single use case, the framework layer **MUST** still go through a controller. Never call a use case from `app/`.
- **R8.4** Cross-use-case atomicity **MUST** be achieved by the controller opening a transaction and threading the handle into each use case.
- **R8.5** A controller **SHOULD** map one-to-one to a user-facing operation (one entry point ≈ one controller).

---

## 9. The Presenter Pattern

A presenter converts entity models into plain, serializable, UI-friendly output DTOs **before** data leaves the core. It uses **field whitelisting**: every returned field is named explicitly.

```ts
function presenter(todo: Todo, instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan(
    { name: 'toggleTodo Presenter', op: 'serialize' },
    () => ({
      id: todo.id,
      todo: todo.todo,
      userId: todo.userId,
      completed: todo.completed,
    })
  );
}
```

### Why

1. **Security.** A `User` model carries `password_hash`. A presenter that maps `{ id, username }` guarantees the hash never reaches a client, regardless of what the model looks like next year.
2. **Performance / bundle size.** Formatting (dates, currency, i18n) done in the presenter means the browser receives a string and does not need to ship `date-fns` or similar.
3. **Stability.** Adding a column to the model does not silently change the API contract.

### Rules

- **R9.1** Every controller **MUST** define a `presenter` function in the same file and return its result.
- **R9.2** Presenters **MUST** whitelist fields explicitly. Spreading the model (`{ ...todo }`) or returning it directly is **FORBIDDEN**.
- **R9.3** Presenter output **MUST** be a plain, JSON-serializable object or array of such objects (no class instances, no `Date` objects unless the consumer contract explicitly requires them—prefer ISO strings).
- **R9.4** Sensitive fields (password hashes, tokens, internal IDs, PII not needed by the consumer) **MUST NOT** appear in presenter output.
- **R9.5** Formatting concerns (date formatting, number formatting, label lookup) **SHOULD** be done in the presenter rather than in the UI.
- **R9.6** The controller's return type **MUST** be `ReturnType<typeof presenter>` so the DTO shape is derived from the presenter, not hand-declared.
- **R9.7** Presenters **MUST NOT** perform I/O or call ports other than instrumentation.

---

## 10. Error Handling Across Boundaries

Errors are the core's *outward API*. Each layer throws domain errors; only the outermost layer decides what a user sees.

| Layer | Throws | Catches |
|---|---|---|
| Infrastructure | `DatabaseOperationError`, `NotFoundError`, `UnauthenticatedError` (after translating vendor errors) | Vendor/SDK errors → report → rethrow as entities error |
| Use case | `UnauthorizedError`, `NotFoundError`, business-rule errors | Nothing (lets errors propagate) |
| Controller | `UnauthenticatedError`, `InputParseError` | Only to roll back a transaction, then rethrows/short-circuits |
| Frameworks & Drivers | Nothing domain-specific | Every entities error it can handle; reports the rest |

### Rules

- **R10.1** Inner layers **MUST** throw entities error classes and **MUST NOT** throw strings, plain `Error`, or vendor error types.
- **R10.2** When wrapping, the original error **MUST** be attached via `{ cause }`.
- **R10.3** Controllers and use cases **MUST NOT** swallow errors or convert them into `{ error: string }` return values. Returning error objects is a framework-layer concern.
- **R10.4** The framework layer **MUST** use `instanceof` against entities error classes to branch on outcome; it **MUST NOT** parse error messages.
- **R10.5** Messages returned to users for unexpected errors **MUST** be generic and **MUST NOT** include stack traces or vendor details.
- **R10.6** Every error class a controller can throw **MUST** be covered by at least one unit test asserting `rejects.toBeInstanceOf(<ErrorClass>)` (§13).

---

## 11. Cross-Cutting Concerns: Instrumentation, Crash Reporting, Transactions

Cross-cutting concerns are **also** ports. This keeps the vendor (Sentry, Datadog, OpenTelemetry) out of the core while still allowing tracing at every level.

```ts
// src/application/services/instrumentation.service.interface.ts
export interface IInstrumentationService {
  startSpan<T>(options: { name: string; op?: string; attributes?: Record<string, any> }, callback: () => T): T;
  instrumentServerAction<T>(name: string, options: Record<string, any>, callback: () => T): Promise<T>;
}
```

The mock is a pass-through:

```ts
export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(_: any, callback: () => T): T { return callback(); }
  async instrumentServerAction<T>(_: string, __: any, callback: () => T): Promise<T> { return callback(); }
}
```

### Rules

- **R11.1** Monitoring, tracing, logging, crash reporting, and transaction management **MUST** be accessed through ports, never via direct SDK import outside `infrastructure`.
- **R11.2** Every use case, controller, presenter, and repository method **SHOULD** wrap its body in `instrumentationService.startSpan` with a descriptive name (`'<name> Use Case'`, `'<name> Controller'`, `'<Repo> > <method>'`, `'<name> Presenter'`) so traces mirror the call hierarchy.
- **R11.3** Database queries **SHOULD** be wrapped in a nested span with `op: 'db.query'`.
- **R11.4** Transaction handles crossing into the core **MUST** be typed as the abstract `ITransaction` from `entities`, not the ORM's type.
- **R11.5** The instrumentation port **MUST** be the first dependency of every curried function (§7.2) for consistency.

---

## 12. Architecture-as-Code: Linter Boundaries

The Dependency Rule is enforced **mechanically**. An invalid import is a lint error, and lint runs in CI, so a boundary violation fails the build.

```jsonc
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "plugins": ["boundaries"],
  "settings": {
    "boundaries/include": ["src/**/*", "app/**/*", "di/**/*"],
    "boundaries/elements": [
      { "mode": "full", "type": "web",                   "pattern": ["app/**/*"] },
      { "mode": "full", "type": "controllers",           "pattern": ["src/interface-adapters/controllers/**/*"] },
      { "mode": "full", "type": "use-cases",             "pattern": ["src/application/use-cases/**/*"] },
      { "mode": "full", "type": "service-interfaces",    "pattern": ["src/application/services/**/*"] },
      { "mode": "full", "type": "repository-interfaces", "pattern": ["src/application/repositories/**/*"] },
      { "mode": "full", "type": "entities",              "pattern": ["src/entities/**/*"] },
      { "mode": "full", "type": "infrastructure",        "pattern": ["src/infrastructure/**/*"] },
      { "mode": "full", "type": "di",                    "pattern": ["di/**/*"] }
    ]
  },
  "rules": {
    "boundaries/no-unknown": "error",
    "boundaries/no-unknown-files": "error",
    "boundaries/element-types": [
      "error",
      {
        "default": "disallow",
        "rules": [
          { "from": "web",                   "allow": ["web", "entities", "di"] },
          { "from": "controllers",           "allow": ["entities", "service-interfaces", "repository-interfaces", "use-cases"] },
          { "from": "infrastructure",        "allow": ["service-interfaces", "repository-interfaces", "entities"] },
          { "from": "use-cases",             "allow": ["entities", "service-interfaces", "repository-interfaces"] },
          { "from": "service-interfaces",    "allow": ["entities"] },
          { "from": "repository-interfaces", "allow": ["entities"] },
          { "from": "entities",              "allow": ["entities"] },
          { "from": "di",                    "allow": ["di", "controllers", "service-interfaces", "repository-interfaces", "use-cases", "infrastructure"] }
        ]
      }
    ]
  }
}
```

Key properties of this configuration:

- `"default": "disallow"` — anything not explicitly allowed is an error (deny-by-default).
- `boundaries/no-unknown` and `no-unknown-files` — a file that doesn't match any element pattern is itself an error, so nobody can sidestep the rules by inventing a new folder.
- Notice that `web` cannot import `controllers`; it must go through `di`. And `di` cannot import `web`.

### Rules

- **R12.1** The project **MUST** include a dependency-boundary linter (e.g. `eslint-plugin-boundaries`, `dependency-cruiser`) configured with deny-by-default and the allow-list from §3.1.
- **R12.2** Lint **MUST** run in CI and **MUST** block merges on violations.
- **R12.3** Adding a new layer folder, or a new sub-folder that needs different rules, **MUST** be accompanied by updating the element list and allow rules in the same pull request.
- **R12.4** Boundary rules **MUST NOT** be disabled inline (`// eslint-disable`) for boundary violations. If a legitimate need arises, change the architecture rule explicitly and document why.
- **R12.5** Path aliases used in imports **MUST** resolve correctly for the linter (configure the resolver) so that aliased imports are checked, not ignored.

---

## 13. Testing: Test Doubles and In-Memory Mocks

Because every external dependency is behind a port, the container can bind **in-memory mocks** under test. The whole core then runs with zero I/O: no database, no network, no auth provider.

### 13.1 Every adapter has a mock twin

```ts
// src/infrastructure/repositories/todos.repository.mock.ts
export class MockTodosRepository implements ITodosRepository {
  private _todos: Todo[] = [];

  async createTodo(todo: TodoInsert): Promise<Todo> {
    const id = this._todos.length;
    const created = { ...todo, id };
    this._todos.push(created);
    return created;
  }
  async getTodo(id: number) { return this._todos.find((t) => t.id === id); }
  async getTodosForUser(userId: string) { return this._todos.filter((t) => t.userId === userId); }
  async updateTodo(id: number, input: Partial<TodoInsert>) {
    const i = this._todos.findIndex((t) => t.id === id);
    const updated = { ...this._todos[i], ...input };
    this._todos[i] = updated;
    return updated;
  }
  async deleteTodo(id: number) { this._todos = this._todos.filter((t) => t.id !== id); }
}
```

Mocks may ship **seed data** for convenient test setup:

```ts
// src/infrastructure/repositories/users.repository.mock.ts
export class MockUsersRepository implements IUsersRepository {
  private _users: User[] = [
    { id: '1', username: 'one',   password_hash: hashSync('password-one', PASSWORD_SALT_ROUNDS) },
    { id: '2', username: 'two',   password_hash: hashSync('password-two', PASSWORD_SALT_ROUNDS) },
    { id: '3', username: 'three', password_hash: hashSync('password-three', PASSWORD_SALT_ROUNDS) },
  ];
  // ...
}
```

### 13.2 Environment-based binding

Selected in `di/modules/*.module.ts` (see §6.2): `process.env.NODE_ENV === 'test'` → mock; otherwise → real adapter. Tests resolve everything through the **same** `getInjection` the app uses, so the wiring itself is exercised.

### 13.3 Test layout and style

```ts
// tests/unit/interface-adapters/controllers/todos/create-todo.controller.test.ts
import { expect, it } from 'vitest';
import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoController = getInjection('ICreateTodoController');

it('creates todo', async () => {
  const { session } = await signInUseCase({ username: 'one', password: 'password-one' });

  expect(createTodoController({ todo: 'Test application' }, session.id))
    .resolves.toMatchObject([{ todo: 'Test application', completed: false, userId: '1' }]);
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({ username: 'one', password: 'password-one' });

  expect(createTodoController({}, session.id)).rejects.toBeInstanceOf(InputParseError);
  expect(createTodoController({ todo: '' }, session.id)).rejects.toBeInstanceOf(InputParseError);
});

it('throws for unauthenticated', () => {
  expect(createTodoController({ todo: "Doesn't matter" }, undefined))
    .rejects.toBeInstanceOf(UnauthenticatedError);
});
```

```ts
// tests/unit/application/use-cases/todos/create-todo.use-case.test.ts
it('creates todo', async () => {
  const { session } = await signInUseCase({ username: 'one', password: 'password-one' });

  expect(createTodoUseCase({ todo: 'Write unit tests' }, session.userId))
    .resolves.toMatchObject({ todo: 'Write unit tests', userId: '1', completed: false });
});
```

### 13.4 CI

```yaml
# .github/workflows/test.yml (shape)
on: [push]
jobs:
  test:
    steps:
      - checkout
      - setup node
      - npm ci
      - npm run lint          # boundary enforcement
      - npm run coverage      # vitest run --coverage
      - upload coverage
```

### Rules

- **R13.1** Every real adapter **MUST** have a sibling `.mock.ts` implementing the same port with in-memory state.
- **R13.2** Mocks **MUST** be functionally faithful (same contract, same thrown entities errors) but **MUST NOT** perform I/O.
- **R13.3** Mocks **MAY** contain seed data. Seed data **MUST** be documented in the mock file, since tests depend on it.
- **R13.4** Unit tests **MUST** target use cases and controllers (the core). Infrastructure adapters **MAY** be covered by separate integration tests against a real database; those **MUST NOT** run in the unit suite.
- **R13.5** Unit tests **MUST** resolve subjects via `getInjection` with `NODE_ENV=test`, not by importing mocks and hand-wiring (except for targeted tests that need a custom double).
- **R13.6** Each controller test file **MUST** include: a happy-path case, one case per `InputParseError` scenario, and an unauthenticated case. Use-case tests **MUST** include the happy path and every authorization/not-found branch.
- **R13.7** Test names **SHOULD** describe behavior in plain language (`'creates todo'`, `'throws for unauthenticated'`), not implementation.
- **R13.8** The unit suite **MUST** run without any environment services (database, network). If a test needs a running service, it is not a unit test.
- **R13.9** Coverage **MUST** be measured in CI and **SHOULD** be reported to a coverage service. The core layers **SHOULD** target 100% coverage; the architecture makes this cheap.

---

## 14. Recipe: Adding a Feature (Inside-Out Workflow)

Work from the innermost layer outward. Each step compiles and can be tested before the next one exists. Worked example: **"Archive a todo"** (soft-delete with an `archivedAt` timestamp, only by its owner).

### Step 0 — Decide the operation boundary

- One user-facing operation → one controller.
- Break it into atomic business operations → one use case each.
- List the external capabilities needed → ports (reuse existing ones first).

Here: one controller `archiveTodoController`, one use case `archiveTodoUseCase`, reuse `ITodosRepository` (extended), `IAuthenticationService`, `IInstrumentationService`.

### Step 1 — Entities: models and errors

1. Extend or add the model in `src/entities/models/`.
   ```ts
   export const selectTodoSchema = z.object({
     id: z.number(),
     todo: z.string(),
     completed: z.boolean(),
     userId: z.string(),
     archivedAt: z.string().datetime().nullable(),   // new
   });
   ```
2. Add any new error class in `src/entities/errors/` (e.g. `AlreadyArchivedError`) if an outer layer must react to it differently.

### Step 2 — Application: ports

1. If a new capability is needed, add or extend a port under `src/application/repositories/` or `src/application/services/`.
   ```ts
   export interface ITodosRepository {
     // ...existing
     archiveTodo(id: number, tx?: ITransaction): Promise<Todo>;   // new
   }
   ```
2. Do **not** implement anything yet. The core only needs the contract.

### Step 3 — Application: use case

Create `src/application/use-cases/todos/archive-todo.use-case.ts`:

```ts
export type IArchiveTodoUseCase = ReturnType<typeof archiveTodoUseCase>;

export const archiveTodoUseCase =
  (instrumentationService: IInstrumentationService, todosRepository: ITodosRepository) =>
  (input: { todoId: number }, userId: string, tx?: ITransaction): Promise<Todo> =>
    instrumentationService.startSpan({ name: 'archiveTodo Use Case', op: 'function' }, async () => {
      const todo = await todosRepository.getTodo(input.todoId);
      if (!todo) throw new NotFoundError('Todo does not exist');
      if (todo.userId !== userId) throw new UnauthorizedError('Cannot archive todo. Reason: unauthorized');
      if (todo.archivedAt) throw new AlreadyArchivedError('Todo is already archived');
      return await todosRepository.archiveTodo(todo.id, tx);
    });
```

Checklist: curried ✔ · one operation ✔ · authorization ✔ · returns entity ✔ · no input-shape validation ✔ · no auth ✔.

### Step 4 — Infrastructure: mock first, then real adapter

1. Extend `todos.repository.mock.ts` with `archiveTodo` (in-memory). **Do this before the real one**—it unblocks tests immediately.
2. Extend `todos.repository.ts` with the real query, wrapped in spans, translating DB errors to entities errors.
3. Add/adjust the database schema and migration (outside `src/`).

### Step 5 — Interface Adapters: controller + presenter

Create `src/interface-adapters/controllers/todos/archive-todo.controller.ts`:

```ts
function presenter(todo: Todo, instrumentationService: IInstrumentationService) {
  return instrumentationService.startSpan({ name: 'archiveTodo Presenter', op: 'serialize' }, () => ({
    id: todo.id,
    todo: todo.todo,
    completed: todo.completed,
    archivedAt: todo.archivedAt,
  }));
}

const inputSchema = z.object({ todoId: z.number() });

export type IArchiveTodoController = ReturnType<typeof archiveTodoController>;

export const archiveTodoController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    archiveTodoUseCase: IArchiveTodoUseCase
  ) =>
  async (input: Partial<z.infer<typeof inputSchema>>, sessionId: string | undefined) =>
    instrumentationService.startSpan({ name: 'archiveTodo Controller' }, async () => {
      if (!sessionId) throw new UnauthenticatedError('Must be logged in to archive a todo');
      const { session } = await authenticationService.validateSession(sessionId);

      const { data, error } = inputSchema.safeParse(input);
      if (error) throw new InputParseError('Invalid data', { cause: error });

      const todo = await archiveTodoUseCase({ todoId: data.todoId }, session.userId);
      return presenter(todo, instrumentationService);
    });
```

### Step 6 — Composition Root: register

1. `di/types.ts` — add `IArchiveTodoUseCase` and `IArchiveTodoController` to **both** `DI_SYMBOLS` and `DI_RETURN_TYPES`.
2. `di/modules/todos.module.ts` — bind both with `toHigherOrderFunction`, listing dependencies in parameter order:
   ```ts
   todosModule.bind(DI_SYMBOLS.IArchiveTodoUseCase)
     .toHigherOrderFunction(archiveTodoUseCase, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.ITodosRepository]);

   todosModule.bind(DI_SYMBOLS.IArchiveTodoController)
     .toHigherOrderFunction(archiveTodoController, [
       DI_SYMBOLS.IInstrumentationService,
       DI_SYMBOLS.IAuthenticationService,
       DI_SYMBOLS.IArchiveTodoUseCase,
     ]);
   ```

### Step 7 — Unit tests (mirror the path)

- `tests/unit/application/use-cases/todos/archive-todo.use-case.test.ts`: happy path, not found, unauthorized (user `'2'` archiving user `'1'`'s todo), already archived.
- `tests/unit/interface-adapters/controllers/todos/archive-todo.controller.test.ts`: happy path (assert presenter shape), `InputParseError` for `{}` and for wrong types, `UnauthenticatedError` for `undefined` session.

Run `npm test` — everything is green with no database.

### Step 8 — Frameworks & Drivers: entry point

Add the server action / route handler / CLI command:

```ts
export async function archiveTodo(todoId: number) {
  const instrumentationService = getInjection('IInstrumentationService');
  return instrumentationService.instrumentServerAction('archiveTodo', { recordResponse: true }, async () => {
    try {
      const sessionId = cookies().get(SESSION_COOKIE)?.value;
      const archiveTodoController = getInjection('IArchiveTodoController');
      await archiveTodoController({ todoId }, sessionId);
    } catch (err) {
      if (err instanceof InputParseError)      return { error: err.message };
      if (err instanceof UnauthenticatedError) return { error: 'Must be logged in to archive a todo' };
      if (err instanceof NotFoundError)        return { error: 'Todo does not exist' };
      if (err instanceof AlreadyArchivedError) return { error: 'Todo is already archived' };
      getInjection('ICrashReporterService').report(err);
      return { error: 'An error happened while archiving the todo. The developers have been notified.' };
    }
    revalidatePath('/');
    return { success: true };
  });
}
```

Then wire the UI.

### Step 9 — Lint, then ship

`npm run lint` must pass with zero boundary violations. If it fails, the fix is to move code to the correct layer—never to relax the rule.

---

## 15. Quick Reference Checklists

### Pull-request checklist

- [ ] Every new file has a layer role suffix and sits in the matching folder.
- [ ] No import points outward (lint passes).
- [ ] New external capability? → port in `application/`, adapter **and** mock in `infrastructure/`.
- [ ] New use case: curried, one operation, authorization inside, no auth, no schema parsing, returns entity, tx param last, `I…UseCase` type exported.
- [ ] New controller: curried, auth first, Zod `safeParse` → `InputParseError`, composes use cases, returns via whitelisting presenter, `I…Controller` type exported.
- [ ] `DI_SYMBOLS` and `DI_RETURN_TYPES` updated; module binding dep order matches parameters.
- [ ] Tests added at mirrored path: happy path + every thrown error class.
- [ ] Entry point maps every entities error to a response and reports the rest.
- [ ] No vendor error type, ORM type, or framework type crosses into `src/application` or `src/entities`.

### "Where does this go?" decision table

| I need to… | Layer |
|---|---|
| Define the shape of a thing | `entities/models` |
| Define a failure the app can signal | `entities/errors` |
| Describe what I need from a DB / API / SDK | `application/repositories` or `application/services` (port) |
| Implement one business operation | `application/use-cases` |
| Check "may this user do this?" | inside the use case |
| Check "is this user logged in?" | controller |
| Parse/validate raw input | controller (schema at top of file) |
| Run several operations atomically | controller + `ITransactionManagerService` |
| Shape data for the client | presenter (inside controller file) |
| Talk to Postgres / Drizzle / Prisma / Lucia / Sentry | `infrastructure` adapter |
| Fake that talk for tests | `infrastructure` `.mock.ts` |
| Choose real vs. mock, wire dependencies | `di/modules/*.module.ts` |
| Read cookies, redirect, revalidate, set status codes | `app/` (frameworks) |
| Turn an error into a user message | `app/` (frameworks) |

---

## 16. Glossary

| Term | Definition |
|---|---|
| **Adapter** | Concrete class in `infrastructure/` implementing a port with real technology. |
| **Composition Root** | The single place (`di/`) where all dependency bindings are declared. |
| **Controller** | Curried function in `interface-adapters/` that authenticates, validates, orchestrates use cases, and presents. |
| **Core** | Entities + Application layers; framework- and vendor-free. |
| **Dependency Rule** | Source dependencies point only inward. |
| **DIP** | Dependency Inversion Principle: inner layers own the abstraction; outer layers implement it. |
| **DTO** | Plain serializable object produced by a presenter. |
| **Entity** | Model or domain error in `entities/`. |
| **Higher-Order Function Injection** | Supplying dependencies via the outer function of a curried function. |
| **IoC** | Inversion of Control: the container, not the consumer, decides which implementation to use. |
| **Mock** | In-memory adapter used under `NODE_ENV=test`. |
| **Port** | Interface declared in `application/` describing a capability the core needs. |
| **Presenter** | Function that whitelists entity fields into a DTO. |
| **Use case** | Curried function in `application/use-cases/` performing one business operation with authorization. |
