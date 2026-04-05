# 🚀 **Complete Deployment Guide**

## **Domain Registration (Step 1)**

### **Namecheap Setup**
1. Go to [namecheap.com](https://www.namecheap.com)
2. Search for your domain: `fanderestaurant.com` or `yourbusiness.com`
3. Complete purchase ($8.88/year)
4. Note: You'll configure DNS later

---

## **Backend Deployment (Step 2) - Railway**

### **Setup Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub repository

### **Deploy Backend**
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Choose the root directory (not /server)
4. Railway will auto-detect Node.js

### **Add Environment Variables**
In Railway dashboard, add these variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=(Railway will provide this)
STRIPE_SECRET_KEY=sk_live_your_live_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=youremail@gmail.com
ZELLE_EMAIL=your_zelle_email@gmail.com
JWT_SECRET=your_super_secure_secret_here
CLIENT_URL=https://yourdomain.com
```

### **MongoDB Setup**
Railway automatically provides MongoDB:
1. In Railway, click "New" → "Database" → "Add MongoDB"
2. Copy the connection string
3. Use it as `MONGODB_URI` in environment variables

### **Seed Database**
1. In Railway dashboard, go to "Settings" → "Environment"
2. Add temporary variable: `SEED_DB=true`
3. Deploy again - this will populate your menu items
4. Remove `SEED_DB=true` after first deploy

---

## **Frontend Deployment (Step 3) - Vercel**

### **Setup Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### **Vercel Configuration**
1. Set these build settings:
   - **Framework Preset:** Create React App
   - **Build Command:** `cd client && npm run build`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install && cd client && npm install`

### **Add Environment Variables**
In Vercel dashboard:
```env
REACT_APP_API_URL=https://your-railway-app.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
```

### **Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Get your Vercel URL (e.g., `yourapp.vercel.app`)

---

## **Domain Connection (Step 4)**

### **Connect Domain to Vercel**
1. In Vercel project dashboard
2. Go to "Settings" → "Domains"
3. Add your domain: `yourdomain.com`
4. Note the nameservers Vercel provides

### **Update Namecheap DNS**
1. Login to Namecheap
2. Go to "Domain List" → "Manage"
3. Change nameservers to Vercel's:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Wait 24-48 hours for DNS propagation

---

## **SSL & Security (Step 5)**

### **Automatic SSL**
Both Vercel and Railway provide free SSL automatically.

### **Security Headers**
Your backend already includes:
- Helmet.js security headers
- CORS protection
- Rate limiting
- Input validation

---

## **Payment Setup (Step 6)**

### **Stripe Live Mode**
1. Go to [stripe.com](https://stripe.com) dashboard
2. Switch to "Live mode" (toggle in sidebar)
3. Get your Live API keys:
   - Secret Key: `sk_live_...`
   - Publishable Key: `pk_live_...`
4. Update environment variables in Railway and Vercel

### **Zelle Setup**
1. Ensure Zelle is set up with your business bank account
2. Update `ZELLE_EMAIL` in Railway environment
3. Test by sending yourself a payment

---

## **Email Configuration (Step 7)**

### **Gmail Setup for Business**
1. Use your business email or Gmail
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
4. Update `EMAIL_PASS` in Railway environment

### **Custom Domain Email (Optional)**
For professional emails like `orders@yourdomain.com`:
1. Use Google Workspace ($6/user/month)
2. Or use services like Zoho Mail (free tier available)

---

## **Testing & Launch (Step 8)**

### **Pre-Launch Checklist**
- [ ] Domain loads correctly
- [ ] All menu items display
- [ ] Cart functionality works
- [ ] Delivery ZIP codes validated
- [ ] Test Stripe payment (use test card `4242 4242 4242 4242`)
- [ ] Test Zelle order (check email instructions)
- [ ] Order confirmation emails sent
- [ ] Admin dashboard accessible
- [ ] Mobile responsive design

### **Test Orders**
1. Place a test cash order
2. Place a test Zelle order
3. Place a test Stripe order
4. Check admin dashboard for all orders
5. Verify emails are received

### **Launch**
1. Update Stripe to live mode
2. Remove test products if any
3. Announce to customers!

---

## **Monitoring & Maintenance**

### **Railway Monitoring**
- Check Railway dashboard for uptime
- Monitor logs for errors
- Database usage tracking

### **Vercel Monitoring**
- Check deployment status
- Monitor bandwidth usage
- Review error logs

### **Daily Tasks**
- Check new orders in admin dashboard
- Respond to customer emails
- Monitor payment confirmations

---

## **Scaling Options**

### **When You Grow**
1. **Railway Pro ($5 → $20/month):**
   - More database storage
   - Higher traffic limits
   - Better performance

2. **Vercel Pro ($20/month):**
   - Custom analytics
   - Team collaboration
   - Advanced features

3. **Additional Services:**
   - SMS notifications (Twilio)
   - Customer support chat
   - Advanced inventory management

---

## **Backup Strategy**

### **Database Backup**
Railway automatically backs up your database, but you can also:
1. Use MongoDB Compass to export data
2. Create regular manual exports
3. Store backups in Google Drive

### **Code Backup**
Your code is safely stored in:
- GitHub (primary repository)
- Railway (deployed version)
- Vercel (deployed version)

---

## **Troubleshooting**

### **Domain Not Loading**
- Check nameservers are correct
- Wait 24-48 hours for DNS propagation
- Use DNS checker tools online

### **Orders Not Saving**
- Check Railway logs for database errors
- Verify MONGODB_URI is correct
- Ensure Railway MongoDB is running

### **Emails Not Sending**
- Check Gmail App Password
- Verify EMAIL_HOST and EMAIL_PORT
- Test with a simple email first

### **Payment Issues**
- Verify Stripe keys are in live mode
- Check Stripe dashboard for declined payments
- Ensure SSL is working (padlock in browser)

---

## **Support & Resources**

### **Documentation**
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### **Status Pages**
- [Railway Status](https://status.railway.app)
- [Vercel Status](https://vercel-status.com)
- [Stripe Status](https://status.stripe.com)

### **Emergency Contacts**
- Railway Support: support@railway.app
- Vercel Support: Available in dashboard
- Stripe Support: Available in dashboard

---

**🎉 Congratulations! Your restaurant is now online!**