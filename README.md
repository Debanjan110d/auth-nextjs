# Next.js Authentication System with Email Verification

A complete authentication system built with Next.js 15, featuring user signup, login, email verification, and protected routes.

## 🚀 Features

- ✅ User Registration & Login
- ✅ Email Verification with Token
- ✅ Protected Routes with Middleware
- ✅ JWT Token Authentication
- ✅ MongoDB Database Integration
- ✅ Professional Email Templates
- ✅ Secure Password Hashing (bcrypt)
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript Support

## 📦 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Email:** Nodemailer
- **Styling:** Tailwind CSS
- **Security:** bcryptjs for password hashing

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd auth-nextjs
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
TOKEN_SECRET=your_jwt_secret_key_here

# Domain
DOMAIN=http://localhost:3000

# Email Configuration (Gmail example)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=your_email@gmail.com
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
auth-nextjs/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       ├── login/route.ts
│   │   │       ├── signup/route.ts
│   │   │       ├── logout/route.ts
│   │   │       ├── me/route.ts
│   │   │       └── verifyEmail/route.ts
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── profile/
│   │   │   └── [id]/page.tsx
│   │   ├── verifyemail/page.tsx
│   │   └── layout.tsx
│   ├── dbconfig/
│   │   └── dbconfig.ts
│   ├── helpers/
│   │   ├── mailer.ts
│   │   └── getDataFromToken.ts
│   ├── models/
│   │   └── usermodel.js
│   └── proxy.ts (middleware)
└── package.json
```

## 🐛 Common Issues Encountered & Solutions

### **Issue #1: Database Model Field Name Inconsistency**

**❌ Your Mistake:**
```javascript
// In usermodel.js
VerifyToken: String,        // PascalCase
VerifyTokenExpiry: Date     // PascalCase
```

**✅ The Fix:**
```javascript
// Changed to camelCase for consistency
verifyToken: String,
verifyTokenExpiry: Date
```

**Why it matters:** JavaScript/TypeScript convention uses camelCase. The mailer.ts was creating `verifyToken` but the model had `VerifyToken`, causing database queries to fail.

---

### **Issue #2: API Route Case Sensitivity**

**❌ Your Mistake:**
- Folder named: `verifyEmail` (capital E)
- API call using: `/api/users/verifyemail` (lowercase e)
- Result: 404 Not Found

**✅ The Fix:**
Changed API call to match folder name:
```typescript
await axios.post("/api/users/verifyEmail", { token });
```

**Why it matters:** Next.js routes are case-sensitive. The folder structure must exactly match the URL path.

---

### **Issue #3: Missing Token Validation**

**❌ Your Mistake:**
```typescript
// No validation before database query
const {token} = reqbody;
const user = await User.findOne({verifyToken: token});
```

**✅ The Fix:**
```typescript
const {token} = reqbody;
if (!token) {
    return NextResponse.json({error: "Token is required"}, {status: 400});
}
const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});
```

**Why it matters:** Prevents unnecessary database queries and provides clear error messages.

---

### **Issue #4: Typo in API Response**

**❌ Your Mistake:**
```typescript
return NextResponse.json({message: "Email verified successfully", sucess: true});
//                                                                  ^^^^^^^ typo
```

**✅ The Fix:**
```typescript
return NextResponse.json({message: "Email verified successfully", success: true});
```

**Why it matters:** Frontend checks for `success` property, typo causes verification to fail.

---

### **Issue #5: Middleware Blocking Verification Page**

**❌ Your Mistake:**
```typescript
const isPublicPath = path === "/login" || path === "/signup" || path === "/verifyemail";

if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
}
```

**Problem:** When logged-in users clicked verification link, they were redirected to home page.

**✅ The Fix:**
```typescript
// Allow verification page to bypass all checks
if (path === "/verifyemail") {
    return NextResponse.next();
}

const isPublicPath = path === "/login" || path === "/signup";
```

**Why it matters:** Verification links should work regardless of login status. Users might be logged in when they click the email link.

---

### **Issue #6: Poor URL Token Parsing**

**❌ Your Mistake:**
```typescript
const urlToken = window.location.search.split("=")[1];
```

**Problem:** Doesn't handle URL-encoded tokens properly, breaks with special characters.

**✅ The Fix:**
```typescript
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get("token");
```

**Why it matters:** Tokens contain special characters that get URL-encoded. URLSearchParams automatically decodes them.

---

### **Issue #7: Router Redirect Issues**

**❌ Your Mistake:**
```typescript
setTimeout(() => {
    router.push("/login");
}, 3000);
```

**Problem:** Sometimes redirects to port 3000 instead of `/login` route.

**✅ The Fix:**
```typescript
setTimeout(() => {
    router.replace("/login"); // Use replace instead of push
}, 3000);
```

**Why it matters:** `router.replace()` replaces the current history entry instead of adding a new one, providing cleaner navigation.

---

### **Issue #8: Missing Loading States**

**❌ Your Mistake:**
- No loading indicator during verification
- No feedback for "no token" scenario
- Poor error handling

**✅ The Fix:**
```typescript
const [loading, setLoading] = useState(false);

// Show loading spinner
{loading && !verifyied && !error && (
    <div className="animate-spin ..."></div>
)}

// Show "no token" warning
{!token && !loading && (
    <div>No Token Found</div>
)}
```

**Why it matters:** Users need visual feedback for what's happening. Good UX requires clear state indicators.

---

### **Issue #9: Removed Unused Console.log**

**❌ Your Mistake:**
```typescript
console.log(user); // Left in production code
```

**✅ The Fix:**
Removed unnecessary console.log statements.

**Why it matters:** Console logs can expose sensitive data in production and clutter the console.

---

## 🔄 Email Verification Flow

1. **User Signs Up** → Account created with `isVerified: false`
2. **System Generates Token** → Hashed token with 1-hour expiry
3. **Email Sent** → Professional HTML email with verification link
4. **User Clicks Link** → Opens `/verifyemail?token=<hash>`
5. **Auto Verification** → Frontend extracts token, calls API
6. **API Validates** → Checks token validity and expiry
7. **Success** → Updates `isVerified: true`, clears token
8. **Redirect** → Auto-redirects to login after 3 seconds

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens for authentication
- ✅ Token expiry (1 hour for email verification)
- ✅ One-time use verification tokens
- ✅ Protected routes with middleware
- ✅ HTTP-only cookies for token storage
- ✅ Input validation on all endpoints

## 📧 Email Configuration

For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `MAIL_PASS`

## 🎨 UI Features

- Modern, responsive design
- Loading states with spinners
- Success/Error feedback with icons
- Auto-redirect after verification
- Mobile-friendly interface
- Clean color scheme

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/signup` | POST | Create new user account |
| `/api/users/login` | POST | Authenticate user |
| `/api/users/logout` | GET | Clear auth token |
| `/api/users/me` | GET | Get current user data |
| `/api/users/verifyEmail` | POST | Verify email with token |

## 🚦 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Protected | Home page |
| `/login` | Public | Login page |
| `/signup` | Public | Registration page |
| `/profile/[id]` | Protected | User profile |
| `/verifyemail` | Public | Email verification |

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License

## 👨‍💻 Developer Notes

### Key Lessons Learned:
1. Always use consistent naming conventions (camelCase for JS/TS)
2. Next.js routes are case-sensitive
3. Validate input before database operations
4. Provide clear user feedback for all states
5. Handle edge cases (no token, expired token, etc.)
6. Test middleware logic thoroughly
7. Use proper URL parsing for query parameters
8. Implement proper loading and error states

---

**Built with ❤️ using Next.js 15**