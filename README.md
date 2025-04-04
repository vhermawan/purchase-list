# 🧾 Sales Management App

A simple yet functional sales management application built with **React**, **TypeScript**, **Zod**, **Zustand**, **React Hook Form**, and **Tailwind CSS** (ShadCN UI components). This app allows users to manage sales records, including invoice details, itemized sales, and discounts.

## 📦 Features

- ✅ Add new sales with invoice details and itemized products
- ✅ Edit and delete existing sales
- ✅ View detailed information of each sale
- ✅ Real-time form validation using `Zod` and `React Hook Form`
- ✅ Persistent local storage with `Zustand + persist` middleware

## 🛠️ Tech Stack

- **Framework**: React with TypeScript
- **State Management**: Zustand with persist middleware
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Playwright for E2E testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v21 or higher)
- npm or yarn or pnpm
- In this project is use pnpm

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/vhermawan/sales-management-app.git
cd sales-management-app
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm i
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
sales-management-app/
├── src/
│   ├── components/          # UI components
│   │   ├── ui/              # shadcn/ui components
|   |   ├── shared/          # for shared component
│   │   |   ├── ConfirmationDialog.tsx # Dialog for confirmation action
│   │   |   ├── SalesForm.tsx   			 # Form for creating/editing sales
│   │   |   ├── SalesList.tsx   			 # Table listing all sales
│   │   |   └── SalesDetail.tsx 			 # Detailed view of a sale
│   ├── lib/                 # Utilities and state management
│   │   ├── schema.ts        # Zod validation schemas
│   │   ├── utils.ts         # Utils for helper function
│   │   └── store.ts         # Zustand store with persistence
│   ├── pages/               # Pages of app
│   │   └── home/            # Home page component
│   │   |   └── index.tsx 	 
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── tests/                   # Playwright E2E tests
│   ├── sales-workflow.spec.ts
│   ├── data-persistence.spec.ts
│   └── responsive.spec.ts
├── public/                  # Static assets
├── .husky/                  # Husky configuration
├── .github/                 # Github workflow configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── playwright.config.ts     # Playwright testing configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production version
- `pnpm preview` - Preview the production build locally
- `pnpm test` - Run Playwright tests
- `pnpm test:ui` - Open Playwright UI mode

## Testing

This project uses Playwright for end-to-end testing. The test suite covers:

- Basic functionality (CRUD operations)
- Form validation
- Data persistence
- Responsive design
- Complex workflows (multiple items, discounts)

To run the tests:

```bash
# Run the tests
pnpm test

# Open Playwright UI mode
pnpm test:ui
```

## Best Practices Implemented

- Responsive design for all device sizes
- Form validation using Zod schemas
- Persistent state management with Zustand
- Component-based architecture
- TypeScript for type safety
- Comprehensive testing with Playwright
- Modern React patterns (hooks, functional components)
- Optimized build with Vite

## Live Demo

The application is deployed on Vercel and can be accessed at: [https://sales-management-eight.vercel.app/](https://sales-management-eight.vercel.app)

## License

MIT
