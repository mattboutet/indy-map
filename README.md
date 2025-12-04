# Indy Pass Map - New England & Eastern Canada

An interactive map visualization for Indy Pass resorts in New England and Eastern Canada. This project helps skiers and riders plan their trips by visualizing resort locations, drive times, and stats.

## Features

-   **Interactive Map**: Powered by Leaflet and OpenStreetMap.
-   **Drive Time Estimates**: Visual indicators for drive times from a starting location (default: Biddeford, ME).
-   **Filtering**: Filter by drive time, resort type (Alpine/XC), night skiing, and vertical drop.
-   **Resort Details**: View stats like vertical drop, trail count, and direct links to websites and directions.

## Getting Started

### Prerequisites

-   Node.js installed on your machine.

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Technologies Used

-   [React](https://react.dev/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [React Leaflet](https://react-leaflet.js.org/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
