# Backend Integration Guide

## 🚀 Your TRPC Setup is Ready!

Your frontend is now configured to connect to your TRPC backend. Here's how to customize it for your specific backend routes.

## 📋 Current Status

✅ **TRPC Client**: Configured and ready  
✅ **Provider**: Added to layout  
✅ **Test Queries**: Set up with error handling  
✅ **UI**: Ready to display data  

## 🔧 Customizing for Your Backend

### Step 1: Update Query Routes

In `app/(appStack)/home.tsx`, modify the query routes to match your backend:

```typescript
// Replace these with your actual backend routes
const testQuery = (trpc as any).test?.useQuery?.(undefined, {
  // Your options
});

const userQuery = (trpc as any).user?.me?.useQuery?.(undefined, {
  // Your options
});

const createDesignMutation = (trpc as any).design?.create?.useMutation?.({
  // Your options
});
```

### Step 2: Common Backend Route Patterns

Based on your backend structure, update the routes:

```typescript
// If your backend has routes like:
// - /api/trpc/user.getProfile
// - /api/trpc/designs.create
// - /api/trpc/rooms.list

const userQuery = (trpc as any).user?.getProfile?.useQuery?.(undefined, {
  retry: 1,
  staleTime: 5 * 60 * 1000,
});

const createDesignMutation = (trpc as any).designs?.create?.useMutation?.({
  onSuccess: (data) => {
    Alert.alert('Success', 'Design created!');
  },
});

const roomsQuery = (trpc as any).rooms?.list?.useQuery?.(undefined, {
  retry: 1,
});
```

### Step 3: Add Parameters to Queries

If your queries need parameters:

```typescript
// Query with parameters
const userQuery = (trpc as any).user?.getById?.useQuery?.(userId, {
  enabled: !!userId, // Only run when userId exists
});

// Mutation with parameters
const updateUserMutation = (trpc as any).user?.update?.useMutation?.({
  onSuccess: () => {
    userQuery.refetch(); // Refresh data after update
  },
});

// Use the mutation
const handleUpdateUser = () => {
  updateUserMutation.mutate({
    id: userId,
    name: 'New Name',
    email: 'new@email.com'
  });
};
```

### Step 4: Handle Different Data Types

```typescript
// For different response types
const designsQuery = (trpc as any).designs?.list?.useQuery?.(undefined, {
  onSuccess: (data) => {
    console.log('Designs loaded:', data);
    // data might be: { designs: [...], total: 10, page: 1 }
  },
});

const userQuery = (trpc as any).user?.profile?.useQuery?.(undefined, {
  onSuccess: (user) => {
    console.log('User profile:', user);
    // user might be: { id: 1, name: 'John', email: 'john@example.com' }
  },
});
```

## 🧪 Testing Your Backend

### 1. Start Your Backend Server
Make sure your TRPC backend is running on port 3000.

### 2. Test the Connection
- Open your app
- Go to the home screen
- Tap "Test Connection" button
- Check the console for connection status

### 3. Check Console Logs
Look for these messages:
- ✅ `Backend connection successful!` - Connection working
- ❌ `Backend connection failed:` - Check your backend setup

### 4. Common Issues & Solutions

**Connection Refused:**
```
❌ Backend connection failed: [Error: connect ECONNREFUSED]
```
**Solution:** Make sure your backend server is running on port 3000

**Route Not Found:**
```
❌ Backend connection failed: [Error: 404 Not Found]
```
**Solution:** Check your backend route names match the frontend queries

**Authentication Error:**
```
❌ Backend connection failed: [Error: 401 Unauthorized]
```
**Solution:** Check your authentication setup and cookies

## 📝 Example Backend Routes

Here are some common backend route patterns you might have:

```typescript
// Backend router example
export const appRouter = createTRPCRouter({
  user: createTRPCRouter({
    me: publicProcedure.query(() => ({ name: 'John Doe' })),
    getProfile: publicProcedure.query(() => ({ profile: '...' })),
    update: publicProcedure.mutation(({ input }) => ({ success: true })),
  }),
  designs: createTRPCRouter({
    list: publicProcedure.query(() => ({ designs: [] })),
    create: publicProcedure.mutation(({ input }) => ({ id: 1 })),
  }),
  rooms: createTRPCRouter({
    list: publicProcedure.query(() => ({ rooms: [] })),
  }),
});
```

## 🎯 Next Steps

1. **Update Routes**: Modify the query routes in `home.tsx` to match your backend
2. **Test Connection**: Use the test buttons to verify connectivity
3. **Add More Queries**: Add additional queries as needed
4. **Handle Errors**: Customize error handling for your use case
5. **Add Types**: Once working, add proper TypeScript types

## 🔍 Debugging Tips

1. **Check Network Tab**: Look for TRPC requests in your browser's network tab
2. **Console Logs**: All TRPC operations log to console
3. **Backend Logs**: Check your backend server logs for incoming requests
4. **URL Verification**: Ensure the TRPC URL matches your backend

## 📞 Need Help?

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify your backend is running and accessible
3. Ensure your backend routes match the frontend queries
4. Check the network tab for failed requests

Your TRPC setup is ready to go! Just customize the routes to match your backend and you'll be fetching data in no time! 🎉
