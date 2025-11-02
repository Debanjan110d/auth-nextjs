# 🎯 Toast & Loading State Guide

## 📦 What You Need Installed

```bash
npm install react-hot-toast axios
```

## 🔧 Setup (Already Done!)

### 1. Layout Setup (`src/app/layout.tsx`)

The `<Toaster />` component is added to your root layout. This component:

- Renders all toast notifications globally
- Must be placed once in the root layout
- Configured with custom styling and duration

```tsx
<Toaster 
  position="top-center"     // Where toasts appear
  reverseOrder={false}      // Newest toast on top
  toastOptions={{
    duration: 4000,         // How long toast stays (ms)
    style: { ... },         // Custom styling
  }}
/>
```

---

## 🎨 How Toast Works

### Toast Types:

1. **Loading Toast** 

   ```tsx
   toast.loading("Creating your account...", { id: "signup" });
   ```

   - Shows a spinner icon
   - Stays until you dismiss it
   - Use `id` to update/dismiss this specific toast later

2. **Success Toast**

   ```tsx
   toast.success("Account created!", { id: "signup" });
   ```

   - Shows checkmark icon
   - Automatically dismisses after 3 seconds
   - Using same `id` replaces the loading toast

3. **Error Toast**

   ```tsx
   toast.error("Something went wrong!", { id: "signup" });
   ```

   - Shows error icon
   - Automatically dismisses after 4 seconds
   - Using same `id` replaces the loading toast

### 💡 Why Use `id`?

- Same `id` = toast gets **replaced** instead of creating multiple toasts
- Prevents toast spam
- Smooth transition from loading → success/error

---

## ⚡ How Loading State Works

### State Declaration:

```tsx
const [loading, setLoading] = React.useState(false);
```

- `loading`: current state (true/false)
- `setLoading`: function to update state

### Usage in Signup Flow:

```tsx
const onSignUp = async () => {
    try {
        setLoading(true);           // 1️⃣ START: Set to true
        
        toast.loading("...", { id: "signup" });  // 2️⃣ Show loading toast
        
        await axios.post("/api/users/signup", user);  // 3️⃣ API call
        
        toast.success("Success!", { id: "signup" });  // 4️⃣ Show success
        
        router.push("/login");      // 5️⃣ Navigate
        
    } catch (error) {
        toast.error("Failed!", { id: "signup" });     // 6️⃣ Show error
        
    } finally {
        setLoading(false);          // 7️⃣ STOP: Always set to false
    }
}
```

### What `finally` Does:
- Runs **no matter what** (success or error)
- Ensures loading state is reset
- Re-enables the button

---

## 🎯 Loading State Effects

When `loading = true`:

1. **Button Disabled**
   ```tsx
   disabled={buttonDisabled || loading}
   ```

2. **Button Style Changes**
   ```tsx
   className={loading ? "gray-style" : "blue-style"}
   ```

3. **Button Shows Spinner**
   ```tsx
   {loading && <SpinnerIcon />}
   ```

4. **Button Text Changes**
   ```tsx
   {loading ? "Creating Account..." : "Sign Up"}
   ```

5. **Heading Changes**
   ```tsx
   {loading ? "Processing..." : "Create Account"}
   ```

---

## 🔍 Error Handling Explained

```tsx
catch (error: any) {
    toast.error(
        error?.response?.data?.error || "Signup failed. Please try again.",
        { id: "signup" }
    );
}
```

### Breaking It Down:

- `error?.response?.data?.error` 
  - `?` = optional chaining (safe access)
  - Tries to get server error message
  
- `||` = OR operator
  - If no server message, use fallback

- `{ id: "signup" }`
  - Replaces the loading toast

### Possible Error Sources:
1. **Server Error**: `error.response.data.error` (from your API)
2. **Network Error**: Falls back to generic message
3. **Other Errors**: Falls back to generic message

---

## 🎬 Complete Flow Example

### User Clicks "Sign Up":

1. **Validation Check**
   ```
   if (buttonDisabled || loading) return;  ❌ Exit if invalid or loading
   ```

2. **Start Loading**
   ```
   setLoading(true)           ✅ Button disabled + gray
   toast.loading("...")        ✅ Toast appears
   ```

3. **API Call**
   ```
   await axios.post(...)      ⏳ Waiting for response
   ```

4. **Success Path**
   ```
   toast.success("...")       ✅ Loading toast → Success toast
   router.push("/login")      ✅ Navigate to login
   setLoading(false)          ✅ Button enabled again
   ```

5. **Error Path**
   ```
   toast.error("...")         ❌ Loading toast → Error toast
   setLoading(false)          ✅ Button enabled again
   ```

---

## 🎨 Visual States

| State | Button Color | Button Text | Cursor | Clickable | Toast |
|-------|-------------|-------------|---------|-----------|-------|
| **Empty inputs** | Gray | "Sign Up" | not-allowed | ❌ No | None |
| **Valid inputs** | Blue | "Sign Up" | pointer | ✅ Yes | None |
| **Loading** | Gray | "Creating Account..." | not-allowed | ❌ No | Loading toast |
| **Success** | Blue | "Sign Up" | pointer | ✅ Yes | Success toast |
| **Error** | Blue | "Sign Up" | pointer | ✅ Yes | Error toast |

---

## 🚀 Quick Reference

### Show Toast:
```tsx
toast.loading("Message", { id: "unique-id" });
toast.success("Message", { id: "unique-id" });
toast.error("Message", { id: "unique-id" });
```

### Loading Pattern:
```tsx
setLoading(true);     // Start
// ... do work ...
setLoading(false);    // Stop
```

### Always Use try-catch-finally:
```tsx
try {
    setLoading(true);
    // ... API call ...
} catch (error) {
    // ... handle error ...
} finally {
    setLoading(false);  // ⚠️ IMPORTANT: Always reset!
}
```

---

## ✅ Checklist

- [x] `react-hot-toast` installed
- [x] `<Toaster />` added to layout
- [x] Loading state declared
- [x] Toast IDs used consistently
- [x] Loading set to `true` before API call
- [x] Loading set to `false` in `finally` block
- [x] Button disabled during loading
- [x] Error handling with fallback message

---

## 🐛 Common Mistakes to Avoid

❌ **Forgetting `finally` block**
```tsx
try {
    setLoading(true);
} catch (error) {
    setLoading(false);  // ❌ Won't run if no error!
}
```

✅ **Use `finally` instead**
```tsx
try {
    setLoading(true);
} catch (error) {
    // handle error
} finally {
    setLoading(false);  // ✅ Always runs!
}
```

❌ **Different toast IDs**
```tsx
toast.loading("...", { id: "loading" });
toast.success("...", { id: "success" });  // ❌ Creates 2 toasts!
```

✅ **Same toast ID**
```tsx
toast.loading("...", { id: "signup" });
toast.success("...", { id: "signup" });  // ✅ Replaces loading toast
```

---

## 🎓 You're All Set!

Your signup page now has:
- ✅ Professional loading states
- ✅ Beautiful toast notifications  
- ✅ Proper error handling
- ✅ Disabled button during submission
- ✅ Visual feedback for users

Happy coding! 🚀
