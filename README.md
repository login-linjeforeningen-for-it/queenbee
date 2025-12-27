# 🐝 QueenBee

QueenBee is the administrative heart of the bee ecosystem. It serves as a powerful Content Management System (CMS) for [BeeHive](https://login.no) and monitoring and managment tool for our services and systems. This application ties together various APIs and services to provide a seamless experience, like [BeeKeeper](https://beekeeper.login.no), [WorkerBee](https://workerbee.login.no), [TekKom-Bot](https://bot.login.no) and [Internal](https://internal.login.no) API.

## 🛠️ Tech Stack

- **Framework**: [NextJS](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- NodeJS
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Login-Linjeforening-for-IT/queenbee.git
   cd queenbee
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create and edit `.env` and fill in the required secrets.

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🐳 Docker Setup

You can run QueenBee using Docker Compose:

```bash
docker compose up --build
```

The application will be available at `http://localhost:8000`.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
  - `(main)/`: Core CMS features (events, jobs, etc.).
  - `internal/`: Monitoring and system tools.
- `src/components/`: React components.
- `src/utils/`: Helper functions.
- `src/hooks/`: Custom React hooks.
- `public/`: Static assets.