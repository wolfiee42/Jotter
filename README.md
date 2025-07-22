# Jotter

Jotter is a modern, modular, and scalable backend for a personal knowledge management and file storage application. It supports uploading, organizing, and managing images, notes, and PDFs, with foldering, favorites, and transactional safety using MongoDB and Cloudinary.

## Features

- User authentication and onboarding
- Upload and manage images, notes, and PDFs
- Folder organization for all file types
- Favorites and duplication for quick access
- Transactional operations for data consistency
- Recent uploads tracking
- Modular service/controller structure

## Folder Structure

```
Jotter/
├── ecosystem.config.cjs
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── errors/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   │   ├── space/
│   │   ├── user/
│   │   ├── image/
│   │   ├── note/
│   │   ├── pdf/
│   │   ├── folder/
│   │   └── favorite/
│   ├── routes/
│   └── utils/
```

- **config/**: Configuration files (e.g., Cloudinary, DB, ENV variables)
- **errors/**: Custom error classes and handlers
- **lib/**: Utility libraries (e.g., QueryBuilder, PermissionManager)
- **middleware/**: Express middlewares (auth, error handling, validation)
- **modules/**: Main business logic, organized by feature (space, user, image, note, pdf, folder, favorite)
- **routes/**: API route definitions
- **utils/**: Helper utilities (async handling, JWT, email, etc.)

## Initialization & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/wolfiee42/Jotter.git
   cd Jotter
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your MongoDB, Cloudinary, and other secrets.

4. **Run the development server:**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Production build:**
   ```bash
   pnpm build
   pnpm start
   # or
   npm run build
   npm start
   ```

## API Overview

- RESTful endpoints for user, image, note, pdf, folder, and favorite management
- All endpoints require authentication
- See `src/routes/` for route details

## Contribution

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

## License

MIT
