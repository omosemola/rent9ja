# RentNaija — Nigerian Real Estate Rental Platform

> A premium, production-ready mobile application and API for the Nigerian rental housing market.

---

## 🏗 Architecture

```
rentnaija/
├── backend/               # NestJS REST API + WebSocket
│   ├── prisma/            # PostgreSQL schema & seed
│   ├── src/
│   │   ├── common/        # Prisma, Redis, shared infrastructure
│   │   └── modules/       # Feature modules (auth, properties, chat, etc.)
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── mobile/                # Flutter mobile app (iOS & Android)
    └── lib/
        ├── app/           # Root widget, routing, DI
        ├── core/          # Theme, network, storage, widgets, utils
        └── features/      # Feature-based modules
            ├── auth/      # Login, register, onboarding
            ├── home/      # Home feed, landlord dashboard
            ├── search/    # Search with advanced filters
            ├── properties/# Property detail, listing management
            ├── favorites/ # Saved properties & collections
            ├── chat/      # Real-time messaging (Socket.IO)
            ├── profile/   # User profile & settings
            ├── notifications/
            └── subscriptions/
```

## 🚀 Getting Started

### Prerequisites

- **Backend**: Node.js 18+, PostgreSQL 15+, Redis 7+
- **Mobile**: Flutter 3.19+, Dart 3.2+, Android Studio / Xcode

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL & Redis
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database with Nigerian demo data
npx ts-node prisma/seed.ts

# Start development server
npm run start:dev
```

API will be available at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/api`

### Mobile Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Run code generation (if using build_runner)
flutter pub run build_runner build

# Run on device/emulator
flutter run
```

### Test Accounts

| Role     | Email                         | Password     |
|----------|-------------------------------|--------------|
| Admin    | admin@rentnaija.com           | Password123! |
| Landlord | adebayo.properties@gmail.com  | Password123! |
| Hunter   | tunde.seeker@gmail.com        | Password123! |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | `/auth/register`          | Register new user     |
| POST   | `/auth/login`             | Login                 |
| POST   | `/auth/refresh`           | Refresh JWT token     |
| POST   | `/auth/logout`            | Logout                |
| POST   | `/auth/forgot-password`   | Request password reset|
| POST   | `/auth/reset-password`    | Reset password        |
| POST   | `/auth/verify-email`      | Verify email via OTP  |

### Properties
| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | `/properties/search`         | Search with filters & pagination|
| GET    | `/properties/featured`       | Get featured listings          |
| GET    | `/properties/newest`         | Get newest listings            |
| GET    | `/properties/:id`            | Get property details           |
| POST   | `/properties`                | Create property (landlord)     |
| PUT    | `/properties/:id`            | Update property                |
| DELETE | `/properties/:id`            | Delete property                |

### Favorites
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | `/favorites/:propertyId`  | Toggle favorite       |
| GET    | `/favorites`              | Get all favorites     |
| GET    | `/favorites/collections`  | Get collections       |

### Chat
| Method    | Endpoint            | Description               |
|-----------|---------------------|---------------------------|
| GET       | `/chat/conversations`| Get conversations        |
| POST      | `/chat/conversations`| Create conversation      |
| GET       | `/chat/:id/messages` | Get messages             |
| WebSocket | `/chat`             | Real-time messaging      |

### Appointments
| Method | Endpoint                       | Description           |
|--------|--------------------------------|-----------------------|
| POST   | `/appointments`                | Book inspection       |
| GET    | `/appointments`                | Get user appointments |
| PATCH  | `/appointments/:id/status`     | Update status         |

### Reviews
| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| POST   | `/reviews`              | Submit review                |
| GET    | `/reviews/landlord/:id` | Get landlord reviews         |

### Payments
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | `/payments/paystack/initialize` | Init Paystack payment    |
| POST   | `/payments/flutterwave/initialize`| Init Flutterwave payment|
| POST   | `/payments/verify`              | Verify payment (webhook) |
| GET    | `/payments/history`             | Get payment history      |

### Admin
| Method | Endpoint                       | Description           |
|--------|--------------------------------|-----------------------|
| GET    | `/admin/dashboard`             | Dashboard stats       |
| GET    | `/admin/users`                 | List users            |
| PATCH  | `/admin/users/:id/suspend`     | Suspend user          |
| PATCH  | `/admin/listings/:id/approve`  | Approve listing       |
| GET    | `/admin/reports`               | Get reports           |

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Auth**: JWT + Passport
- **Real-time**: Socket.IO
- **Payments**: Paystack / Flutterwave (stubs)
- **Docs**: Swagger / OpenAPI

### Mobile
- **Framework**: Flutter 3.19+
- **State Management**: BLoC (flutter_bloc)
- **Navigation**: GoRouter
- **HTTP**: Dio
- **DI**: GetIt
- **Real-time**: socket_io_client
- **Maps**: Google Maps Flutter
- **UI**: Material 3 + Custom Design System

---

## 🎨 Design System

- **Primary**: Emerald Green (`#0A6847`) — Trust, growth, Nigerian heritage
- **Accent**: Gold (`#D4A017`) — Premium, value
- **Typography**: Outfit (Google Fonts)
- **Dark Mode**: Full support
- **Components**: Cards with 16px radius, smooth gradients, micro-animations

---

## 📋 License

Proprietary. All rights reserved.
