# Fan de Restaurant - Online Ordering System

A complete online ordering system for a Filipino pastry restaurant with pickup and delivery options.

## 🏆 **Cost Breakdown (Monthly)**

**Domain + Hosting: ~$5-15/month**
- Domain (Annual): Namecheap $8.88/year (~$0.75/month)
- Frontend Hosting: Vercel (FREE)
- Backend + Database: Railway ($5/month)

**Total Monthly Cost: ~$5.75/month** 🎉

---

## 🚀 **Quick Start Guide**

### **1. Prerequisites**

Install the following on your computer:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### **2. Setup Project**

```bash
# Navigate to your project folder
cd fan-de-restaurant

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### **3. Environment Setup**

**Server Environment (server/.env):**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/fanderestaurant

# Stripe (Get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Zelle Information
ZELLE_EMAIL=your_zelle_email@gmail.com

# Security
JWT_SECRET=your_very_secure_jwt_secret_here

# Environment
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Client Environment (client/.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### **4. Database Setup**

#### **Option A: Local MongoDB (Free)**
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Database will be created automatically

#### **Option B: MongoDB Atlas (Free Tier)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and update `MONGODB_URI`

### **5. Payment Setup**

#### **Stripe Setup**
1. Create account at [Stripe](https://stripe.com)
2. Get API keys from Dashboard
3. Add keys to environment files

#### **Zelle Setup**
1. Set up Zelle with your bank
2. Add your Zelle email/phone to environment

### **6. Email Setup (Gmail)**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: Google Account → Security → App passwords
3. Use App Password (not regular password) in EMAIL_PASS

### **7. Run the Application**

```bash
# Start both frontend and backend
npm run dev
```

**Access your app:**
- Customer Site: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- API: http://localhost:5000/api

---

## 🌐 **Domain & Hosting Setup**

### **Step 1: Buy Domain**

**Recommended: Namecheap ($8.88/year)**
1. Go to [Namecheap.com](https://www.namecheap.com)
2. Search for your domain (e.g., fanderestaurant.com)
3. Purchase domain

### **Step 2: Deploy Frontend (FREE)**

**Option A: Vercel (Recommended)**
1. Push code to GitHub
2. Connect GitHub to [Vercel](https://vercel.com)
3. Deploy with these settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install && cd client && npm install`

**Option B: Netlify**
1. Push code to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Deploy `client` folder

### **Step 3: Deploy Backend ($5/month)**

**Railway (Recommended)**
1. Push code to GitHub
2. Connect GitHub to [Railway](https://railway.app)
3. Deploy server folder
4. Add environment variables in Railway dashboard
5. Railway provides MongoDB database automatically

### **Step 4: Connect Domain**
1. In Vercel/Netlify, add custom domain
2. Update nameservers at Namecheap

---

## 📱 **Features**

✅ **Customer Features:**
- Browse menu with images
- Add items to cart
- Pickup or delivery options
- ZIP code delivery validation
- Multiple payment methods (Cash, Zelle, Credit Card)
- Order confirmation emails
- Mobile-responsive design

✅ **Admin Features:**
- Order management dashboard
- Real-time order updates
- Customer information tracking
- Payment status monitoring

✅ **Payment Integration:**
- Stripe for credit cards
- Zelle payment instructions
- Cash on pickup option
- Automatic order confirmation emails

✅ **Technical Features:**
- Secure API with rate limiting
- Database with order tracking
- Email notifications
- Responsive design
- SEO-friendly

---

## 🛠 **Development**

### **Folder Structure**
```
fan-de-restaurant/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root scripts
└── README.md        # This file
```

### **Available Scripts**
```bash
npm run dev          # Start both frontend and backend
npm run client       # Start frontend only
npm run server       # Start backend only
npm run build        # Build for production
```

### **Add New Menu Items**
1. Edit `server/scripts/seedProducts.js`
2. Run: `cd server && node scripts/seedProducts.js`

### **Customize Design**
- Colors: Edit Tailwind classes in React components
- Images: Replace image URLs in products
- Branding: Update text in components

---

## 🔐 **Security Features**

- Rate limiting on API endpoints
- Input validation and sanitization
- Secure password hashing
- CORS protection
- Helmet.js security headers
- Environment variable protection

---

## 📧 **Email Templates**

The system automatically sends:
- Order confirmation emails
- Payment instructions for Zelle orders
- Order status updates

Customize email templates in `server/services/emailService.js`

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**MongoDB Connection Error:**
- Check MongoDB is running
- Verify connection string in .env

**Stripe Errors:**
- Verify API keys are correct
- Check if test mode is enabled

**Email Not Sending:**
- Verify Gmail App Password
- Check firewall settings

**Deployment Issues:**
- Check environment variables are set
- Verify build commands
- Check logs in hosting platform

### **Support:**
- Check logs: `npm run dev` shows all errors
- MongoDB logs: Check MongoDB Compass
- Stripe logs: Check Stripe Dashboard

---

## 🎯 **Next Steps & Upgrades**

### **Free Improvements:**
- Add more menu items
- Customize colors and branding
- Add customer reviews
- Social media integration

### **Paid Upgrades ($10-50/month):**
- SMS notifications (Twilio)
- Advanced analytics
- Inventory management
- Customer loyalty program
- Multi-location support

---

## 📞 **Contact & Support**

Need help? Create an issue in this repository or contact support.

**Happy Baking! 🥖**