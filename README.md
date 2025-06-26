# NSS Backend API

Backend API for the National Sports School (NSS) management system built with Express.js and TypeScript.

## 🚀 Features

- **Payment Integration**: Razorpay payment gateway integration
- **TypeScript**: Full TypeScript support with strict type checking
- **Error Handling**: Comprehensive error handling middleware
- **CORS**: Cross-origin resource sharing configured
- **Environment Variables**: Secure configuration management
- **Health Check**: API health monitoring endpoint

## 📁 Project Structure

```
NSS-backend/
├── src/
│   ├── config/             # Configuration files
│   │   └── razorpayClient.ts
│   ├── controllers/        # Route controllers
│   │   └── paymentController.ts
│   ├── middlewares/        # Custom middleware
│   │   └── errorHandler.ts
│   ├── routes/             # API routes
│   │   └── payment.ts
│   ├── services/           # Business logic services
│   │   └── razorpay.ts
│   ├── index.ts           # Application entry point
│   └── server.ts          # Express server setup
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NSS-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run build:watch` - Build in watch mode

## 🔗 API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Payment Routes
- **POST** `/api/payment/create-order` - Create Razorpay order
- **POST** `/api/payment/verify` - Verify payment signature
- **GET** `/api/payment/order/:orderId` - Get order details
- **GET** `/api/payment/key` - Get Razorpay public key

## 💳 Payment Integration

### Create Order
```javascript
POST /api/payment/create-order
Content-Type: application/json

{
  "amount": 2500,        // Amount in rupees
  "receiptId": "NSS_001",
  "notes": {
    "studentId": "STU001",
    "sport": "Cricket"
  }
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_xxxxxxxxxxxx",
    "amount": 250000,     // Amount in paise
    "currency": "INR",
    "receipt": "NSS_001",
    "status": "created"
  }
}
```

### Verify Payment
```javascript
POST /api/payment/verify
Content-Type: application/json

{
  "orderId": "order_xxxxxxxxxxxx",
  "paymentId": "pay_xxxxxxxxxxxx",
  "signature": "signature_hash"
}
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Required |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | Required |

## 🔒 Security Features

- **CORS Protection**: Configured for specific origins
- **Request Size Limits**: JSON payload limit of 10MB
- **Environment Variables**: Sensitive data stored securely
- **Error Handling**: No sensitive information in error responses

## 🚦 Error Handling

The API uses standardized error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Test Razorpay Integration

Use the following test card details:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `razorpay` - Payment gateway

### Development Dependencies
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server
- `@types/node` - Node.js types
- `@types/express` - Express types
- `@types/cors` - CORS types

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=5000
   export RAZORPAY_KEY_ID=your_production_key
   export RAZORPAY_KEY_SECRET=your_production_secret
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## 📋 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] WhatsApp Cloud API integration
- [ ] Student management endpoints
- [ ] Attendance tracking APIs
- [ ] Admin analytics endpoints
- [ ] File upload capabilities
- [ ] Logging system
- [ ] Rate limiting
- [ ] API documentation with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please contact the NSS development team.
