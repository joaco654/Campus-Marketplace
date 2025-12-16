# Campus Marketplace

A universal marketplace app for college students to offer and purchase services from other students on campus.

## Features

- **Welcome Screen**: Beautiful landing page with call-to-action
- **Authentication**: Google OAuth and email/password login
- **School Selection**: Multi-school support with easy onboarding
- **Service Listings**: Create, view, and manage service listings
- **Search & Filter**: Advanced search by keywords, category, price range, and school
- **AI Features**: 
  - Auto-categorization based on description
  - Price suggestions based on category and description
- **Messaging**: In-app chat between buyers and sellers
- **Ratings & Reviews**: Rate and review services after completion
- **Boost Listings**: Promote listings for increased visibility
- **Admin Dashboard**: Manage users, listings, and view analytics

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma)
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google OAuth client (optional, for Google login)

### Installation

1. Clone the repository:
```bash
cd campus-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

The seed script will populate the database with default schools (FAU, UM, UF, FIU, PBSC, FSU, UCF, USF).

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

- **Users**: User accounts with school association
- **Schools**: School information with logos
- **Services**: Service listings with categories, prices, and status
- **Messages**: In-app messaging between users
- **Ratings**: Ratings and reviews for services

## Project Structure

```
campus-marketplace/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── marketplace/      # Marketplace pages
│   ├── admin/            # Admin dashboard
│   └── onboarding/       # Onboarding flow
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Features in Detail

### School Selection
Students select their school during onboarding. Supported schools include:
- FAU (Florida Atlantic University)
- UM (University of Miami)
- UF (University of Florida)
- FIU (Florida International University)
- PBSC (Palm Beach State College)
- And more...

### Service Categories
- Tutoring
- Essay Editing
- Moving Help
- Resume Review
- Graphic Design
- Class Notes
- Photography
- Web Development
- Other

### AI Features
The app uses keyword matching and category-based pricing to suggest:
- Appropriate categories for services
- Competitive pricing based on market rates

## Future Enhancements

- Real-time notifications
- Payment integration
- Image upload functionality
- Mobile app (React Native)
- Advanced analytics
- Email notifications
- Service completion workflow

## License

MIT

