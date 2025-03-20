# Angular Technical Test

A modern Angular application for managing product approvals with a clean architecture and state management using NgRx.

## Features

- View and manage products pending review
- Approve or reject products
- View reviewed products with infinite scroll
- Product details view in a modal dialog
- Local storage persistence
- Responsive design with Angular Material
- State management with NgRx

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v19)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   ├── adapters/
│   │   └── store/
│   ├── features/
│   │   ├── product-list/
│   │   ├── reviewed-products/
│   │   └── product-details/

```

## Technologies Used

- Angular 19
- Angular Material
- NgRx for state management
- RxJS
- TypeScript
- SCSS

## Development

- Run `ng serve` for a dev server
- Run `ng build` to build the project
- Run `ng test` to execute unit tests
- Run `ng e2e` to execute end-to-end tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
