# TaskMaster - Scalable Task Management System

A full-stack task management application with JWT authentication, role-based access control, and RESTful API design.

## 🚀 Features

### Backend
- ✅ User authentication with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User/Admin)
- ✅ RESTful API with versioning (v1)
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Input validation and sanitization
- ✅ Rate limiting for API protection
- ✅ Comprehensive error handling
- ✅ Request logging with Winston
- ✅ API documentation with Swagger
- ✅ Security headers with Helmet
- ✅ CORS enabled

### Frontend
- ✅ React-based UI
- ✅ User registration and login
- ✅ Protected dashboard with JWT
- ✅ Full CRUD operations on tasks
- ✅ Role-based UI rendering
- ✅ Real-time error/success messages
- ✅ Responsive design with Tailwind CSS

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

### Backend Setup

1. **Navigate to the project root:**
```bash
cd taskmaster-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create PostgreSQL database:**
```sql
CREATE DATABASE taskmaster_db;
```

4. **Configure environment variables:**
Create a `.env` file in the root directory and add:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmaster_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
```

5. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL:**
Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

4. **Start the React app:**
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## 🔐 API Endpoints

### Authentication Routes
```
POST   /api/v1/auth/register    - Register new user
POST   /api/v1/auth/login       - Login user
GET    /api/v1/auth/me          - Get current user (protected)
```

### Task Routes (All protected)
```
GET    /api/v1/tasks            - Get all tasks (filtered by user role)
GET    /api/v1/tasks/:id        - Get single task
POST   /api/v1/tasks            - Create new task
PUT    /api/v1/tasks/:id        - Update task
DELETE /api/v1/tasks/:id        - Delete task
```

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task (with JWT token)
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README",
    "status": "pending",
    "priority": "high"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- name (String, NOT NULL)
- email (String, UNIQUE, NOT NULL)
- password (String, NOT NULL, Hashed)
- role (ENUM: 'user', 'admin', Default: 'user')
- isActive (Boolean, Default: true)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Tasks Table
```sql
- id (UUID, Primary Key)
- title (String, NOT NULL)
- description (Text)
- status (ENUM: 'pending', 'in-progress', 'completed')
- priority (ENUM: 'low', 'medium', 'high')
- dueDate (Date, Nullable)
- userId (UUID, Foreign Key -> Users.id)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds of 12
2. **JWT Authentication**: Secure token-based auth
3. **Input Validation**: express-validator for all inputs
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Security Headers**: Helmet.js for HTTP headers
6. **CORS**: Configured for cross-origin requests
7. **SQL Injection Prevention**: Sequelize ORM with parameterized queries
8. **XSS Protection**: Input sanitization

## 📈 Scalability Considerations

### Current Implementation
- **Modular Architecture**: Clean separation of concerns (MVC pattern)
- **Database Connection Pooling**: Optimized database connections
- **Error Handling**: Centralized error handling middleware
- **Logging**: Winston for production-grade logging
- **API Versioning**: Easy to maintain multiple API versions

### Future Scalability Options

#### 1. Microservices Architecture
```
- Auth Service (User management, authentication)
- Task Service (CRUD operations on tasks)
- Notification Service (Email/SMS notifications)
- API Gateway (Route requests to appropriate services)
```

#### 2. Caching Layer
```javascript
// Redis integration for session management
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Cache frequently accessed data
app.get('/api/v1/tasks', async (req, res) => {
  const cacheKey = `tasks:${req.user.id}`;
  
  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from database and cache
  const tasks = await Task.findAll({ where: { userId: req.user.id } });
  await client.setex(cacheKey, 300, JSON.stringify(tasks));
  
  res.json(tasks);
});
```

#### 3. Load Balancing
```nginx
# Nginx configuration for load balancing
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

#### 4. Message Queue
```javascript
// RabbitMQ for asynchronous task processing
const amqp = require('amqplib');

// Publisher (API Service)
const publishTask = async (task) => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('tasks');
  channel.sendToQueue('tasks', Buffer.from(JSON.stringify(task)));
};

// Consumer (Worker Service)
const consumeTasks = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('tasks');
  
  channel.consume('tasks', (msg) => {
    const task = JSON.parse(msg.content.toString());
    // Process task
    channel.ack(msg);
  });
};
```

#### 5. Database Optimization
- **Read Replicas**: Separate read and write operations
- **Indexing**: Add indexes on frequently queried columns
- **Partitioning**: Split large tables by date or user_id
- **Database Sharding**: Horizontal scaling across multiple databases

#### 6. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: taskmaster_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

#### 7. Monitoring & Observability
```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path, status_code: res.statusCode });
  });
  next();
});
```

## 🧪 Testing

### Run Backend Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Production

1. **Set production environment variables**
2. **Build frontend:**
```bash
cd frontend
npm run build
```

3. **Deploy backend to cloud provider** (AWS, Heroku, DigitalOcean)

### Environment-Specific Configurations

**Development**: Hot reload, detailed logging, Swagger docs
**Production**: Optimized builds, minimal logging, security hardened

## 📦 Project Structure
```
taskmaster/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── task.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Task.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── task.routes.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── server.js
│   ├── logs/
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Backend Developer Intern Assignment
**Your Name** - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Express.js for the robust web framework
- Sequelize for excellent ORM capabilities
- React for the dynamic frontend
- PostgreSQL for reliable data storage

---

## ⚡ Quick Start Commands
```bash
# Clone the repository
git clone <your-repo-url>

# Backend setup
cd backend
npm install
# Configure .env file
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
# Configure .env file
npm start
```

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

## 🔄 API Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🎯 Postman Collection

Import the Postman collection for easy API testing:
1. Open Postman
2. Import the collection from `/postman/TaskMaster.postman_collection.json`
3. Set the environment variable `BASE_URL` to `http://localhost:5000/api/v1`
4. After login, set the `TOKEN` variable with your JWT token

---

**Built with ❤️ for the Backend Developer Intern Assignment**