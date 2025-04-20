# Speech Assist App

Speech Assist App is a modern, accessible chat interface built with Next.js, React, and TypeScript. It features text, file, and audio message support, as well as accessibility enhancements and a responsive design.

## Features
- Text chat with content-editable input
- File and image attachments
- Audio message recording and playback
- Accessibility-first design
- Light and dark theme support
- Responsive layout for desktop and mobile

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd speech-assist-app
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

### Running the Development Server

```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

```sh
pnpm build
# or
npm run build
# or
yarn build
```

### Linting & Formatting

```sh
pnpm lint
pnpm format
```

## Project Structure
- `app/` — Next.js app directory (pages, layouts, routes)
- `components/` — Reusable React components
- `hooks/` — Custom React hooks
- `lib/` — Utility functions and shared logic
- `public/` — Static assets
- `styles/` — Global and component styles

## Accessibility
This project aims for high accessibility standards, including keyboard navigation, ARIA roles, and screen reader support.

## License
[MIT](LICENSE)
