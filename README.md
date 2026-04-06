# Example Template

A boilerplate Next.js application with a pre-built sidebar, theming (light/dark mode), authentication scaffolding, and a CRUD module example. Designed to be a starting point for new projects — clone, customize, and build on top of it.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router) |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Ant Design** | ^6.3.2 | UI component library (Table, Modal, Form, etc.) |
| **TanStack React Query** | ^5 | Server state management & caching |
| **Axios** | ^1 | HTTP client |
| **Lucide React** | ^0.577 | Icon library |
| **Framer Motion** | ^12 | Animations |
| **Day.js** | ^1.11 | Date utility |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend URL.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## NPM Scripts

**The easiest way to perform actions is to use the interactive CLI:**

```bash
npm run cli
```

This opens a native **arrow-key navigation menu** where you can dynamically scaffold new modules or completely remove existing modules (with nested confirmation screens) without typing or remembering script commands.

Alternatively, you can run individual scripts:

| Script | Command | Description |
|---|---|---|
| `cli` | `npm run cli` | **(Recommended)** Interactive menu for all commands |
| `dev` | `npm run dev` | Start the Next.js development server |
| `build` | `npm run build` | Build the production bundle |
| `start` | `npm run start` | Start the production server |
| `lint` | `npm run lint` | Run ESLint |
| `add-module` | `npm run add-module <name>` | Scaffold a new module (page + layout + sidebar entry) |
| `remove-module` | `npm run remove-module <name>` | Remove a module (page + layout + sidebar entry) |

### Module Scripts

**Add a module:**

```bash
npm run add-module "Inventory"
```

This will:
1. Create `app/inventory/layout.tsx` and `app/inventory/page.tsx`
2. Add an "Inventory" entry to the sidebar under MODULES

**Remove a module:**

```bash
npm run remove-module "Inventory"
```

This will:
1. Delete the `app/inventory/` directory
2. Remove the sidebar entry

## Project Structure

```
example-template/
├── app/                        # Next.js App Router
│   ├── globals.css             # Global styles & CSS theme variables
│   ├── layout.tsx              # Root layout (providers)
│   ├── page.tsx                # Landing/redirect page
│   ├── login/                  # Login page
│   ├── dashboard/              # Dashboard module
│   ├── crud/                   # CRUD example module
│   │   ├── layout.tsx          # Module layout with sidebar
│   │   ├── page.tsx            # Module page
│   │   └── components/         # Module-specific components
│   │       └── ItemTable.tsx   # Table with search, filter, CRUD actions
│   └── user-management/        # User management module
├── components/                 # Shared components
│   ├── Sidebar.tsx             # Main sidebar navigation
│   ├── Avatar/                 # Avatar component
│   ├── Crud/                   # CRUD dialogs & filter
│   │   ├── EditItemDialog.tsx  # Add/Edit item modal
│   │   ├── ViewItemDialog.tsx  # View item details modal
│   │   └── ItemFilterPopover.tsx # Filter popover (category, status)
│   ├── Providers/              # React Query & Theme providers
│   ├── Settings/               # Settings modal
│   └── Table/                  # Reusable table components
│       ├── StatusChip.tsx      # Active/Inactive status tag
│       └── TableBulkActions.tsx # Reusable floating bulk actions bar
├── hooks/                      # Custom React hooks
│   ├── items/
│   │   └── useItems.ts         # CRUD hooks (mock, with real API examples)
│   ├── login/                  # Auth hooks
│   ├── sidebar/                # Sidebar expansion hook
│   └── table/                  # Table hooks
│       └── useTableUrlSync.ts      # URL & Table state management hook
├── interface/                  # TypeScript interfaces
│   ├── item.ts                 # Item interface
│   └── sidebar.ts              # Sidebar menu types
├── lib/                        # Utilities
│   ├── api.ts                  # API client
│   └── utils.ts                # Tailwind class merging (cn utility)
├── utils/                      # Helper functions
│   └── clipboard.ts            # Clipboard copy utility (context-aware)
├── scripts/                    # CLI scripts
│   ├── add-module.js           # Add module scaffolding
│   └── remove-module.js        # Remove module scaffolding
├── public/                     # Static assets
```

## Core Infrastructure

The template includes essential boilerplate infrastructure to help you focus on feature development out of the box.

### 1. API Interceptor (`lib/api.ts`)
The project includes a pre-configured Axios instance (`api.ts`). It acts as a global **interceptor** to:
- Automatically route requests to your `NEXT_PUBLIC_API_URL`.
- Intercept outgoing requests to attach Authentication headers (e.g., Bearer tokens).
- Intercept incoming responses to handle global API errors (e.g., automatically redirecting to the login page on `401 Unauthorized`).
- **Auto-Toast Messages**: If the backend returns a `message` property in the JSON payload (usually during POST/PUT/DELETE actions), the interceptor automatically displays it as a global UI notification. Pure `GET` fetches generally should not return a `message` to avoid spamming toasts.

### 2. React Query Provider (`components/Providers/query-provider.tsx`)
We use **TanStack React Query** for fetching, caching, and updating asynchronous data. The `QueryProvider`:
- Wraps the root layout to provide the `QueryClient` context to all client components.
- Manages global caching rules, request deduplication, and refetch behaviors.
- Simplifies loading states and mutations without needing complex Redux/Context setups. 

### 3. Theme Provider (`components/Providers/theme-provider.tsx`)
The `ThemeProvider` manages the application's light/dark mode state. It works by:
- Persisting the user's preferred theme (light/dark/system) using `localStorage`.
- Dynamically attaching the `dark` class/data-attribute to the root HTML element.
- Seamlessly integrating with our CSS Variables in `globals.css` to instantly reskin the UI across the entire app.

### 4. Ant Design Static Bridge
To use Ant Design services (like `message`, `notification`, or `modal`) inside non-React files (utilities/hooks), the `ThemeProvider` implements a **Static Bridge** via the `<App />` component.
- This captures context-aware instances of these services.
- **Usage**: Import them from `@/components/Providers/theme-provider` rather than directly from `antd` to ensure they respect the dynamic theme and context.

### 5. Table URL Synchronization (`hooks/table/useTableUrlSync.ts`)
The `useTableUrlSync` hook is a central manager for table logic. It:
- **Autonomous State**: Manages `searchValue`, `activeFilters`, and `pagination` internally.
- **URL Mirroring**: Automatically reflects all table changes in the URL query parameters.
- **Persistence**: Rehydrates the table state from the URL on page reload or navigation.
- **Clean Components**: Allows table components (like `ItemTable.tsx`) to remain lightweight by destructuring pre-built handlers like `handleSearchApply` and `handleFilterApply`.

## Theming

The app supports **light** and **dark** mode via CSS custom properties in `globals.css`.

### CSS Variables

| Variable | Light | Dark | Tailwind Class | Usage |
|---|---|---|---|---|
| `--background` | `#FFFFFF` | `#141414` | `bg-background` | Page backgrounds |
| `--foreground` | `#111827` | `#ffffff` | `text-foreground` | Default text |
| `--text` | `#111111` | `#ffffff` | `text-text` | Primary headings & labels |
| `--text-info` | `#616161` | `#a1a1aa` | `text-text-info` | Secondary/muted text |
| `--primary` | `#0F2A44` | `#1e293b` | `bg-primary` | Brand color |
| `--accent-1` | `#1677ff` | `#3b82f6` | `bg-accent-1` | Links, badges |
| `--accent-2` | `#FF8A3D` | `#f97316` | `bg-accent-2` | Secondary accent |
| `--neutral` | `#F8FAFC` | `#18181b` | `bg-neutral` | Hover backgrounds |
| `--border` | `#f1f5f9` | `#27272a` | `border-border` | Borders & dividers |

**Always use these tokens** instead of hardcoded Tailwind colors (e.g. `text-gray-500`) to ensure dark mode compatibility.

## CRUD Module (Example)

The `app/crud/` module demonstrates a full CRUD pattern:

- **Table** with search, filter popover, pagination, row selection
- **Persistent State**: Search, filters, and pagination are mirrored in the **URL** (via `useTableUrlSync`)
- **Floating Bulk Actions** with dynamic buttons (e.g., Bulk Active/Inactive)
- **Add/Edit dialog** with form validation
- **View dialog** with detailed descriptions and **copy-to-clipboard** buttons
- **Delete confirmation** via `Modal.confirm`
- **Hooks** in `hooks/items/useItems.ts` with mock data

### Connecting to a Real API (Example Template API)

This frontend template is designed to easily plug into the backend counterpart repository: **[example-template-api](https://github.com/jesurena/example-template-api)**.

**Steps to configure the frontend for a live API:**

1. Ensure the backend API (`example-template-api`) is running locally on `http://localhost:8000`.
2. Configure your frontend `.env.local` to point directly to the backend URL:
   ```env
   LARAVEL_API_URL=http://localhost:8000/api
   ```
3. Update the `hooks/items/useItems.ts` logic. By default, out-of-the-box it points to the live backend URL using `useQuery` via Axios.
4. If your backend uses wildcard origins (`Access-Control-Allow-Origin: *`) without authentication, ensure `withCredentials: true` is commented out inside `lib/api.ts` to prevent Chrome/Firefox CORS blockage!

## License

Private — internal use only.