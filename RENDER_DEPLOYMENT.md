# Render.com Deployment Guide

## Prerequisites

1. **Render.com Account** - Sign up at https://render.com
2. **GitHub Repository** - Push your code to GitHub
3. **PostgreSQL Databases** - You'll create these on Render

---

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
cd /Users/ajorsaha/Desktop/Backend/micro-services/preli-demo
git init
git add .
git commit -m "Initial commit - University Management System"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create PostgreSQL Databases on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Create 4 databases:
   - **student-db** (Name: `student_db`)
   - **course-db** (Name: `course_db`)
   - **faculty-db** (Name: `faculty_db`)
   - **enrollment-db** (Name: `enrollment_db`)

4. **Save the Internal Database URLs** for each (format: `postgresql://...`)

### Step 3: Deploy Student Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `student-service`
   - **Root Directory:** `services/student-service`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `Dockerfile.render`
   - **Plan:** Free or Starter

4. **Environment Variables:**
   ```
   PORT=3001
   DATABASE_URL=<student-db-internal-url>
   NODE_ENV=production
   ```

5. Click **"Create Web Service"**

### Step 4: Deploy Course Service

Repeat Step 3 with:
- **Name:** `course-service`
- **Root Directory:** `services/course-service`
- **Environment Variables:**
  ```
  PORT=3002
  DATABASE_URL=<course-db-internal-url>
  NODE_ENV=production
  ```

### Step 5: Deploy Faculty Service

Repeat Step 3 with:
- **Name:** `faculty-service`
- **Root Directory:** `services/faculty-service`
- **Environment Variables:**
  ```
  PORT=3003
  DATABASE_URL=<faculty-db-internal-url>
  NODE_ENV=production
  ```

### Step 6: Deploy Enrollment Service

Repeat Step 3 with:
- **Name:** `enrollment-service`
- **Root Directory:** `services/enrollment-service`
- **Environment Variables:**
  ```
  PORT=3004
  DATABASE_URL=<enrollment-db-internal-url>
  STUDENT_SERVICE_URL=<student-service-render-url>
  COURSE_SERVICE_URL=<course-service-render-url>
  NODE_ENV=production
  ```

### Step 7: Run Database Migrations

For each service, after deployment:

1. Go to service dashboard
2. Click **"Shell"** tab
3. Run migrations:
   ```bash
   npm run db:migrate
   ```

---

## Important Notes

### 1. **Service URLs**
After deployment, Render gives you URLs like:
- `https://student-service.onrender.com`
- `https://course-service.onrender.com`
- `https://faculty-service.onrender.com`
- `https://enrollment-service.onrender.com`

### 2. **Free Tier Limitations**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to Starter plan for production

### 3. **Health Checks**
Render will automatically ping `/health` endpoints

### 4. **Database Migrations**
Run migrations after first deployment or schema changes

### 5. **Inter-Service Communication**
Use Render's internal URLs (provided in dashboard) for `STUDENT_SERVICE_URL` and `COURSE_SERVICE_URL`

---

## Testing After Deployment

```bash
# Test health endpoints
curl https://student-service.onrender.com/health
curl https://course-service.onrender.com/health
curl https://faculty-service.onrender.com/health
curl https://enrollment-service.onrender.com/health

# Create a student
curl -X POST https://student-service.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@university.edu",
    "studentId": "STU001",
    "phone": "+1234567890"
  }'
```

---

## Alternative: Deploy Without Docker

If Docker builds are slow, you can use native Node.js deployment:

1. In Render dashboard, choose **"Node"** instead of **"Docker"**
2. Set:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

---

## Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Dockerfile paths

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database is in same region as service
- Use **Internal Database URL** (not external)

### Service Not Responding
- Check if service is sleeping (free tier)
- View logs in Render dashboard
- Ensure PORT is set correctly

---

## Cost Estimate (Render.com)

- **Free Tier:**
  - 4 PostgreSQL databases: Free (750 hours/month each)
  - 4 Web Services: Free (750 hours/month each)
  - Total: **$0/month** (with limitations)

- **Starter Tier:**
  - 4 PostgreSQL databases: $7/month each = $28/month
  - 4 Web Services: $7/month each = $28/month
  - Total: **$56/month** (no sleep, better performance)

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure CORS for frontend
3. ✅ Set up monitoring/alerts
4. ✅ Configure auto-deploy from GitHub
5. ✅ Add API documentation
6. ✅ Set up CI/CD pipeline
