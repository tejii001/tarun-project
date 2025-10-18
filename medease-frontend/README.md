# MEDEASE Frontend

A React.js frontend application for the MEDEASE medical appointment booking and consultation platform.

## Features

- **User Authentication**: Login and registration for patients and doctors
- **Patient Dashboard**: View appointments, book new appointments, access medical records
- **Doctor Dashboard**: Manage appointments, view patient information, track earnings
- **Appointment Booking**: Calendar-based appointment scheduling with real-time availability
- **Real-time Consultation**: Chat and video consultation using WebRTC
- **Payment Integration**: Secure payment processing with Razorpay/Stripe
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **React 18+** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Socket.io-client** for real-time communication
- **WebRTC** for video consultations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Patient/         # Patient-specific pages
│   ├── Doctor/          # Doctor-specific pages
│   ├── Appointment/     # Appointment booking
│   ├── Consultation/    # Chat and video consultation
│   └── Payment/         # Payment processing
├── services/           # API service functions
├── store/              # Redux store and slices
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.jsx             # Main application component
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=your_razorpay_key
VITE_STRIPE_KEY=your_stripe_key
```

## API Integration

The frontend communicates with the Spring Boot backend through REST APIs:

- **Authentication**: `/api/auth/*`
- **Appointments**: `/api/appointments/*`
- **Consultations**: `/api/consultations/*`
- **Payments**: `/api/payments/*`

## Real-time Features

- **WebSocket**: Real-time messaging during consultations
- **WebRTC**: Peer-to-peer video calling
- **Socket.io**: Event-driven real-time communication

## Payment Integration

Supports multiple payment gateways:

- **Razorpay**: Cards, UPI, Net Banking, Wallets
- **Stripe**: Cards, Apple Pay, Google Pay

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.