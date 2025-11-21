# Curious Kitchen

A real-time spice inventory management app built with [TinyBase](https://tinybase.org/), React, TypeScript, and deployed on Cloudflare Workers + Pages.

This application demonstrates:
- **Real-time synchronization** between multiple browser windows/tabs using WebSockets
- **Local persistence** using browser storage
- **Server-side persistence** using Cloudflare Durable Objects
- **Modern UI** built with React, Tailwind CSS, and shadcn/ui components

## 🏗️ Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main application component
│   │   └── store.ts       # TinyBase store configuration
│   ├── package.json
│   └── vite.config.ts
│
└── server/                # Backend WebSocket server
    ├── index.ts           # Cloudflare Worker with Durable Objects
    ├── package.json
    └── wrangler.toml      # Cloudflare Workers configuration
```

## 🧠 How It Works

### Architecture

1. **Client (React + Vite)**
   - Built with React 19 and TypeScript
   - Uses TinyBase for state management with a MergeableStore
   - Styled with Tailwind CSS v4 and shadcn/ui components
   - Connects to the WebSocket server for real-time sync

2. **Server (Cloudflare Workers + Durable Objects)**
   - WebSocket server deployed as a Cloudflare Worker
   - Uses Durable Objects for persistent storage and synchronization
   - Each URL path creates a separate sync "room"
   - Data persists even when all clients disconnect

3. **Data Flow**
   - Client changes → Local TinyBase store → Browser storage
   - Client changes → WebSocket → Durable Object → All connected clients
   - New client connects → Loads from browser storage → Syncs with Durable Object

### Data Model

The app uses a single `spices` table with the following schema:

- **name** (string) - The name of the spice (e.g., "Cinnamon")
- **category** (string) - Category: "herb", "seed", "bark", "root", "flower", "fruit", "leaf", or "other"
- **quantity** (number) - Amount in grams
- **inStock** (boolean) - Whether the spice is currently available

Plus a `values` store for local UI state (not synced):
- **viewMode** (string) - Current view mode: "cards" or "table"

## 🚀 Local Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spices
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
npm install
```

4. **Run the development server (optional)**
   ```bash
   # In the server directory
   npm run dev
   ```
   This starts a local Wrangler dev server on `localhost:8787`

5. **Run the client**
   ```bash
   # In the client directory
npm run dev
```

6. **Update the server URL (if running local server)**
   
   Edit `client/src/App.tsx` and change:
   ```typescript
   const SERVER = 'localhost:8787';  // For local development
   ```

7. Open your browser to the URL shown (usually `http://localhost:5173`)

## 📦 Deploying to Cloudflare

This application is designed to be deployed to Cloudflare's edge network using Workers (for the backend) and Pages (for the frontend).

### Prerequisites for Deployment

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works!)
2. Wrangler CLI installed in the server directory (already included in `package.json`)

### Step 1: Authenticate with Cloudflare

```bash
cd server
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### Step 2: Deploy the Server (Cloudflare Worker with Durable Objects)

1. **Update the server name (optional)**
   
   Edit `server/wrangler.toml`:
   ```toml
   name = "your-app-name-server"  # Change this to your preferred name
   ```

2. **Deploy the Worker**
   ```bash
   cd server
   npm run deploy
   ```

3. **Note the deployed URL**
   
   After deployment, you'll see output like:
   ```
   Deployed your-app-name-server triggers (1.42 sec)
     https://your-app-name-server.your-subdomain.workers.dev
   ```
   
   Copy this URL - you'll need it for the client configuration.

### Step 3: Configure the Client

Update `client/src/App.tsx` to point to your deployed server:

```typescript
const SERVER_SCHEME = 'wss://';
const SERVER = 'your-app-name-server.your-subdomain.workers.dev';  // Your Worker URL (without wss://)
```

### Step 4: Deploy the Client (Cloudflare Pages)

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Create a Pages project (first time only)**
   ```bash
   # From the project root
   ./server/node_modules/.bin/wrangler pages project create your-app-name --production-branch=main
   ```

3. **Deploy to Pages**
   ```bash
   # From the project root
   ./server/node_modules/.bin/wrangler pages deploy client/dist --project-name=your-app-name
   ```

4. **Your app is live!**
   
   You'll see output like:
   ```
   ✨ Deployment complete! Take a peek over at https://your-app-name.pages.dev
   ```

### Important Notes

- **Workers.dev subdomain**: When you first deploy a Worker, Cloudflare creates a `*.workers.dev` subdomain for your account. If you see an error about needing a workers.dev subdomain, visit the [Cloudflare Workers dashboard](https://dash.cloudflare.com) and open the Workers section to initialize it.

- **Durable Objects**: This app uses Durable Objects for persistence, which are available on the Workers free tier with limitations. See [Cloudflare's pricing page](https://developers.cloudflare.com/workers/platform/pricing/) for details.

- **Local storage key**: The client stores data locally using a key based on the server URL. If you change the server URL, you'll need to clear browser storage or update the key in `App.tsx`.

### Continuous Deployment

For production apps, consider setting up:
- **GitHub Actions** or **Cloudflare Pages Git integration** for automatic deployments on push
- **Environment variables** for different environments (dev/staging/prod)
- **Custom domains** via Cloudflare's dashboard

## ⚙️ Configuration

### Server Configuration (`server/wrangler.toml`)

```toml
name = "your-app-name-server"              # Worker name
main = "index.ts"                          # Entry point
compatibility_date = "2024-10-11"          # Cloudflare compatibility date
workers_dev = true                         # Deploy to workers.dev subdomain

[[durable_objects.bindings]]
name = "TinyBaseDurableObjects"            # Binding name used in code
class_name = "TinyBaseDurableObject"       # Class name

[[migrations]]
tag = "v1"                                  # Migration version
new_sqlite_classes = ["TinyBaseDurableObject"]  # Required for free tier
```

### Server Persistence (`server/index.ts`)

To disable server-side persistence (only sync between active clients):

```typescript
const PERSIST_TO_DURABLE_OBJECT = false;  // Change to false
```

### Client Configuration (`client/src/App.tsx`)

```typescript
const SERVER_SCHEME = 'wss://';            // WebSocket scheme (wss:// for production)
const SERVER = 'your-server.workers.dev';  // Your Worker URL
```

## 🔧 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui
- **State Management**: TinyBase (MergeableStore)
- **Backend**: Cloudflare Workers + Durable Objects
- **Real-time Sync**: WebSockets via TinyBase synchronizers
- **Hosting**: Cloudflare Pages (frontend) + Workers (backend)

## 🎨 Features

- ✅ Add, edit, and delete spices
- ✅ Real-time synchronization across multiple browser tabs/windows
- ✅ Persistent storage (survives browser refresh and server restarts)
- ✅ Toggle between card and table views
- ✅ Search and filter capabilities
- ✅ Responsive design
- ✅ Dark mode support (via Tailwind)

## 📝 Using as a Starter Template

To use this as a starter for your own TinyBase + Cloudflare app:

1. **Fork or clone this repository**
2. **Update the data model** in `client/src/store.ts`
3. **Modify the UI components** in `client/src/components/`
4. **Rename the app** (update package names, titles, etc.)
5. **Follow the deployment steps above**

Key files to customize:
- `client/src/store.ts` - Your TinyBase schema and data operations
- `client/src/components/` - Your UI components
- `server/wrangler.toml` - Server configuration and name
- `client/src/App.tsx` - Main app layout and server connection

## 🐛 Troubleshooting

### "Project not found" error when deploying Pages
Create the Pages project first:
```bash
./server/node_modules/.bin/wrangler pages project create your-app-name --production-branch=main
```

### WebSocket connection fails
- Check that the `SERVER` constant in `client/src/App.tsx` matches your deployed Worker URL
- Ensure you're using `wss://` (not `ws://`) for production
- Check that the Worker deployed successfully

### Durable Objects errors
- Make sure you're using `new_sqlite_classes` (not `new_sql_tables`) in `wrangler.toml` for the free tier
- Durable Objects have rate limits on the free tier - see [Cloudflare docs](https://developers.cloudflare.com/durable-objects/)

## 📚 Resources

- [TinyBase Documentation](https://tinybase.org/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## License

This template has no license, and so you can use it however you want!
[TinyBase](https://github.com/tinyplex/tinybase/blob/main/LICENSE) and
[Vite](https://github.com/vitejs/vite/blob/main/LICENSE) themselves are both MIT
licensed.
