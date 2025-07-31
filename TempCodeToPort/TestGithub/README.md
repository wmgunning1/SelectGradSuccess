# USI Graduate Success Tools

A React TypeScript application for USI Property & Casualty Deliverables that provides tools to track and analyze graduate success metrics.

## Features

- **Dashboard**: Main landing page with navigation to different tools
- **Producer Table**: View and filter producer performance data
- **Producer Detail**: Detailed metrics and analytics for individual producers

## Screenshots Reference

The application implements three main screens based on the provided designs:

1. **Main Dashboard** - "Select Graduate Success Tools" with USI branding and navigation buttons
2. **Producer Table** - Filterable table showing producer performance metrics including success scores
3. **Producer Detail** - Comprehensive view of individual producer metrics with success scoring

## Tech Stack

- React 18
- TypeScript
- React Router DOM
- Vite (build tool)
- CSS3 with custom styling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx       # Main landing page
│   ├── ProducerTable.tsx   # Producer list with filters
│   └── ProducerDetail.tsx  # Individual producer metrics
├── App.tsx                 # Main app component with routing
├── App.css                 # Application styles
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Data Structure

The application uses mock data for demonstration. In a production environment, this would be replaced with API calls to fetch real producer data.

### Producer Data Model
- Basic info (name, tenure, book size)
- Performance metrics (appointments, win rates, etc.)
- Success scores and rankings
- Risk factors and flags

## Styling

The application uses custom CSS with USI brand colors:
- Primary blue: #1e3a8a
- Secondary blue: #3b82f6
- Accent: #06b6d4

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Ensure all components are properly typed
3. Test navigation between all screens
4. Maintain responsive design principles

## License

This project is proprietary to USI Insurance Services.
