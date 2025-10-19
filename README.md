# ClarityAccess - ADA Compliance Scanner

ClarityAccess is a production-grade web accessibility scanner that helps you identify WCAG 2.1 A/AA compliance issues on any website. Built with Next.js, TypeScript, and powered by Google PageSpeed Insights.

## Features

- 🎯 **Instant Scanning** - Get accessibility results in seconds
- 📊 **Detailed Reports** - View violations with actionable fixes
- 🔒 **Type-Safe** - Built with strict TypeScript for reliability
- ♿ **Accessible** - Follows WCAG 2.1 best practices
- 🚀 **Production-Ready** - Robust error handling and validation

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- A Google Cloud account for PageSpeed Insights API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rokstr86/ClarityAccess.git
cd ClarityAccess
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
# Required: Google PageSpeed Insights API Key
# Get your key at: https://developers.google.com/speed/docs/insights/v5/get-started
PSI_API_KEY=your_api_key_here

# Optional: Stripe keys (for payment integration - not yet implemented)
# STRIPE_SECRET_KEY=your_stripe_secret_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Important:** Without the `PSI_API_KEY`, the scan functionality will not work. The application will display a helpful error message to guide you.

### Getting a PageSpeed Insights API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the PageSpeed Insights API
4. Go to "Credentials" and create an API key
5. Add the API key to your `.env.local` file

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## Project Structure

```
ClarityAccess/
├── app/
│   ├── api/
│   │   ├── scan/
│   │   │   ├── page.tsx      # Scan page component
│   │   │   └── route.ts      # Scan API endpoint
│   │   └── ping/
│   │       └── route.ts      # Health check endpoint
│   ├── pricing/
│   │   └── page.tsx          # Pricing page
│   ├── layout.tsx            # Root layout with Navbar/Footer
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   ├── navbar.tsx            # Navigation component
│   └── footer.tsx            # Footer component
├── lib/
│   └── scan.ts               # Core scanning logic and types
├── public/                   # Static assets
├── .env.local               # Environment variables (create this!)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── eslint.config.mjs        # ESLint configuration
```

## API Endpoints

### GET /api/scan

Scan a URL for accessibility issues.

**Query Parameters:**
- `url` (required): The URL to scan (must be https://)

**Example:**
```bash
curl "http://localhost:3000/api/scan?url=https://example.com"
```

### POST /api/scan

Alternative method for scanning a URL.

**Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "score": 85,
  "violations": [...],
  "passes": 42,
  "incomplete": 0,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## TypeScript Types

All major types are exported from `lib/scan.ts`:

- `ScanResult` - Complete scan result object
- `AxeViolation` - Individual accessibility violation
- `AxeNode` - DOM node with an issue

## Error Handling

The application includes comprehensive error handling:

- **Missing API Key**: Clear message directing users to obtain a key
- **Invalid URLs**: Client-side validation with helpful messages
- **API Failures**: Detailed error messages from PageSpeed Insights
- **Network Errors**: User-friendly connection error messages

## Accessibility

ClarityAccess is built with accessibility in mind:

- ✅ Semantic HTML throughout
- ✅ ARIA labels and landmarks
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Screen reader friendly

## Future Enhancements

### Stripe Payment Integration

Payment processing is not yet implemented. To add it:

1. Set up a Stripe account at https://stripe.com
2. Create products and pricing plans in Stripe Dashboard
3. Add Stripe keys to `.env.local`
4. Install Stripe packages: `npm install stripe @stripe/stripe-js`
5. Create `/app/api/checkout/route.ts` for Checkout sessions
6. Update the Subscribe button in `app/pricing/page.tsx`

See the TODO comments in `app/pricing/page.tsx` for more details.

### Additional Pages

Create these pages for a complete site:
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Google PageSpeed Insights API** - Accessibility scanning engine
- **React 19** - UI library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

All rights reserved © 2025 ClarityAccess

## Support

For questions or issues:
- Email: support@clarityaccess.co
- GitHub Issues: [Create an issue](https://github.com/rokstr86/ClarityAccess/issues)

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Remember to add `PSI_API_KEY` to your production environment variables.
