
# AtithiStay

A full-stack web application for listing and booking accommodations, built with Express.js, MongoDB, and EJS. The application enables users to create listings, leave reviews, and manage their accommodation properties.

## Overview

AtithiStay (अतिथि स्टे - "Guest Stay" in Hindi) is an Airbnb-like platform where users can:
- **Browse** accommodation listings with images and detailed information
- **Create & Manage** their own property listings
- **Leave Reviews** for accommodations they've visited
- **Authenticate** securely with user accounts
- **Upload Images** to Cloudinary for hosting

## Tech Stack

- **Backend**: Node.js (v20.11.1) with Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.0.1
- **Template Engine**: EJS with EJS-Mate
- **Authentication**: Passport.js with Local Strategy
- **Storage**: Cloudinary for image uploads
- **Maps**: Mapbox SDK for geolocation features
- **Validation**: Joi for data validation
- **Session Management**: Express-session with MongoDB store

## Language Composition

- JavaScript: 46.6%
- EJS: 31.8%
- CSS: 21.6%

## Features

### User Authentication
- Local authentication with Passport.js
- Secure session management using MongoDB store
- Password hashing with passport-local-mongoose
- User registration and login functionality

### Listings Management
- Create, read, update, and delete accommodation listings
- Add property details: title, description, price, location, country
- Upload images via Cloudinary
- Geospatial indexing for map-based queries
- Owner-based listing management

### Reviews System
- Leave reviews on listings
- Automatic cleanup of reviews when listings are deleted
- Rating and feedback functionality

### Maps Integration
- Mapbox integration for location visualization
- Geospatial queries with 2dsphere indexing
- Coordinate validation (longitude, latitude)

### Security Features
- CSRF protection with method-override
- Data validation with Joi
- Custom error handling
- Flash messages for user feedback
- HTTP-only cookies for session security

## Project Structure

```
AtithiStay/
├── models/              # Mongoose schemas (Listing, User, Review)
├── routes/              # API routes (listings, reviews, users)
├── views/               # EJS templates
├── public/              # Static assets (CSS, JavaScript)
├── utils/               # Utility functions (error handling)
├── init/                # Database initialization scripts
├── app.js               # Main application file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanchaybhagat9-cyber/AtithiStay.git
   cd AtithiStay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables** (create `.env` file)
   ```
   NODE_ENV=production
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   MAP_TOKEN=your_mapbox_token
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the application**
   ```bash
   node app.js
   ```

   The application will start on `http://localhost:8080`

## Database Models

### Listing
- Title, description, price
- Location and country
- Image (URL and filename)
- Geospatial coordinates for mapping
- Owner reference
- Reviews array

### User
- Email and password (hashed)
- Passport authentication integration

### Review
- Rating and comments
- Reference to listing and author

## API Routes

- `GET /listings` - View all listings
- `GET /listings/:id` - View listing details
- `POST /listings` - Create new listing (authenticated)
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)
- `POST /listings/:id/reviews` - Add review (authenticated)
- `GET /` - Home page with user signup/login

## Key Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `ejs` & `ejs-mate` - Template engine
- `passport` & `passport-local` - Authentication
- `cloudinary` - Image storage
- `@mapbox/mapbox-sdk` - Geolocation services
- `joi` - Data validation
- `dotenv` - Environment configuration

## Security Notes

- Sessions are stored in MongoDB for persistence
- Passwords are hashed using passport-local-mongoose
- CORS and input validation implemented
- Error handling prevents information leakage

## Future Enhancements

- Booking system with date availability
- Payment processing (Stripe/Razorpay)
- Advanced search and filters
- User profile pages
- Email notifications
- Admin dashboard

## License

ISC

## Author

Aditya Narayan
Sanchay Bhagat

---

**Note**: This project is built with security and scalability in mind, using industry-standard libraries for authentication, data validation, and file handling.
```

This README provides a complete overview of the AtithiStay project, covering its purpose, tech stack, features, installation instructions, and project structure. It's ready to be added to the repository!
