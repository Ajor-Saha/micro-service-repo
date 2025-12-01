# Docker Deployment Guide

This guide explains how to run the entire University Management System using Docker.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- At least 4GB of available RAM
- Ports 3000-3004 and 5441-5444 available

## Quick Start

### Option 1: Using the Start Script (Recommended)

```bash
./start.sh
```

This will:
- Build all Docker images
- Start all services and databases
- Display service status and access points

### Option 2: Using Docker Compose Directly

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Services

The system consists of 9 containers:

### Databases (PostgreSQL 15)
- **student-db**: Port 5441
- **course-db**: Port 5442
- **faculty-db**: Port 5443
- **enrollment-db**: Port 5444

### Backend Microservices (Node.js 18)
- **student-service**: Port 3001
- **course-service**: Port 3002
- **faculty-service**: Port 3003
- **enrollment-service**: Port 3004

### Frontend (Next.js 16)
- **frontend**: Port 3000

## Access Points

- **Frontend Application**: http://localhost:3000
- **Student API**: http://localhost:3001/api
- **Course API**: http://localhost:3002/api
- **Faculty API**: http://localhost:3003/api
- **Enrollment API**: http://localhost:3004/api

## Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f student-service
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart student-service
```

### Stop Services
```bash
# Stop all (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers, and delete volumes (all data)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build student-service

# Rebuild and restart
docker-compose up --build -d
```

### Execute Commands in Containers
```bash
# Access container shell
docker-compose exec student-service sh

# Run npm commands
docker-compose exec student-service npm run db:migrate
```

## Environment Variables

All services use environment variables defined in `docker-compose.yml`. You can override them by creating a `.env` file:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Services
NODE_ENV=production
```

## Troubleshooting

### Port Already in Use
If ports are already taken, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3001"  # Change first number: "NEW_PORT:3001"
```

### Service Won't Start
1. Check logs: `docker-compose logs -f [service-name]`
2. Verify databases are ready: `docker-compose ps`
3. Restart the service: `docker-compose restart [service-name]`

### Database Connection Issues
1. Ensure databases are healthy: `docker-compose ps`
2. Wait 10-15 seconds after starting for databases to initialize
3. Check connection strings in docker-compose.yml

### Out of Memory
Increase Docker memory limit in Docker Desktop settings (minimum 4GB recommended).

### Clean Start
```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose up --build -d
```

## Production Considerations

For production deployment:

1. **Use environment files**: Create `.env.production` with secure credentials
2. **Enable HTTPS**: Add Nginx reverse proxy with SSL certificates
3. **Database backups**: Set up automated PostgreSQL backups
4. **Monitoring**: Add logging and monitoring tools (Prometheus, Grafana)
5. **Scaling**: Use Docker Swarm or Kubernetes for horizontal scaling
6. **Security**: 
   - Change default PostgreSQL passwords
   - Use Docker secrets for sensitive data
   - Implement rate limiting
   - Enable CORS properly

## Network Architecture

All services communicate through the `university-network` Docker bridge network:

```
Frontend (3000) 
    ↓ HTTP
Student Service (3001) ← → student-db (5432 internal)
Course Service (3002) ← → course-db (5432 internal)
Faculty Service (3003) ← → faculty-db (5432 internal)
Enrollment Service (3004) ← → enrollment-db (5432 internal)
                            ↓ HTTP
                    Student & Course Services
```

## Data Persistence

Data is persisted in Docker volumes:
- `student-data`
- `course-data`
- `faculty-data`
- `enrollment-data`

To backup data:
```bash
docker run --rm -v preli-demo_student-data:/data -v $(pwd):/backup alpine tar czf /backup/student-data-backup.tar.gz -C /data .
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub issues
4. Contact the development team
