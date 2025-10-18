# MEDEASE Backend

A Spring Boot backend application for the MEDEASE medical appointment booking and consultation platform.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Patient and doctor registration and profile management
- **Appointment Management**: CRUD operations for appointments with real-time availability
- **Real-time Communication**: WebSocket support for chat and video consultations
- **Payment Integration**: Support for Razorpay and Stripe payment gateways
- **RESTful APIs**: Comprehensive REST API endpoints
- **Database Integration**: MySQL/PostgreSQL with JPA/Hibernate
- **Security**: Spring Security with JWT tokens

## Tech Stack

- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **MySQL 8.0** / **PostgreSQL 14+**
- **WebSocket** for real-time communication
- **Maven** for dependency management
- **Swagger/OpenAPI** for API documentation

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+ or PostgreSQL 14+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medease-backend
```

2. Configure database in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medease_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Install dependencies:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE medease_db;
```

2. The application will automatically create tables on startup (Hibernate DDL auto)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment
- `GET /api/appointments/doctors` - Get all doctors
- `GET /api/appointments/available-slots` - Get available time slots

### Consultations
- `GET /api/consultations` - Get all consultations
- `POST /api/consultations` - Start consultation
- `PUT /api/consultations/{id}/end` - End consultation
- `POST /api/consultations/{id}/messages` - Send message
- `GET /api/consultations/{id}/messages` - Get messages

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund` - Process refund

## WebSocket Endpoints

- `/ws` - WebSocket connection endpoint
- `/topic/consultation/{id}` - Consultation messages
- `/queue/notifications` - User notifications

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `patients` - Patient-specific information
- `doctors` - Doctor-specific information
- `appointments` - Appointment scheduling
- `consultations` - Consultation sessions
- `payments` - Payment transactions

### Relationships
- User 1:1 Patient
- User 1:1 Doctor
- Patient 1:N Appointments
- Doctor 1:N Appointments
- Appointment 1:1 Consultation
- Appointment 1:1 Payment

## Security Configuration

- JWT token-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Role-based access control (PATIENT, DOCTOR, ADMIN)

## Environment Variables

Create a `application.properties` file:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/medease_db
spring.datasource.username=root
spring.datasource.password=password

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Testing

Run tests with Maven:
```bash
mvn test
```

## Deployment

### Build for Production
```bash
mvn clean package
```

### Docker Deployment
```bash
docker build -t medease-backend .
docker run -p 8080:8080 medease-backend
```

### Cloud Deployment
- **AWS**: Elastic Beanstalk, ECS, or EC2
- **Azure**: App Service or Container Instances
- **GCP**: Cloud Run or Compute Engine

## API Documentation

Once the application is running, access Swagger UI at:
`http://localhost:8080/swagger-ui.html`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
