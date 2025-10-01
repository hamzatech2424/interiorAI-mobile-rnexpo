# TRPC Setup Guide for InteriorAI

## Current Status
Your TRPC client is set up but not fully functional because the backend router types are not available yet. Here's how to complete the setup once your backend is ready.

## 1. Backend Requirements

Your backend needs to:
1. Have a TRPC router with the following structure:
   ```typescript
   // Backend router structure
   export const appRouter = createTRPCRouter({
     user: createTRPCRouter({
       useQuery: publicProcedure.query(() => ({})),
       update: createTRPCRouter({
         useMutation: publicProcedure.mutation(() => ({}))
       })
     }),
     design: createTRPCRouter({
       create: createTRPCRouter({
         useMutation: publicProcedure.mutation(() => ({}))
       }),
       list: createTRPCRouter({
         useInfiniteQuery: publicProcedure.query(() => ({}))
       })
     })
   });
   ```

2. Export the router type:
   ```typescript
   export type AppRouter = typeof appRouter;
   ```

## 2. Frontend Setup (When Backend is Ready)

### Step 1: Update TRPC Service
Replace the content in `services/trpc.ts`:

```typescript
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from '@interiorai/types'; // Your backend types

export const trpc = createTRPCReact<AppRouter>();
export const TRPCProvider = trpc.Provider;
```

### Step 2: Update Layout
In `app/_layout.tsx`, add the TRPC provider:

```typescript
import { TRPCProvider } from '@/services/trpc';
import { getTrpcClient } from '@/services/trpc-setup';

// In your component:
const [trpcClient] = useState(() => getTrpcClient());

// In your return statement, wrap with TRPCProvider:
return (
  <TRPCProvider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      {/* Your app content */}
    </QueryClientProvider>
  </TRPCProvider>
);
```

### Step 2.1: Enable Backend Connection
In `services/trpc-setup.ts`, change the `BACKEND_READY` flag to `true`:

```typescript
const BACKEND_READY = true; // Change this when backend is ready
```

### Step 3: Enable TRPC Queries
In `app/(appStack)/home.tsx`, uncomment the TRPC examples:

```typescript
// Uncomment these when backend is ready
const userQuery = trpc.user.useQuery("me", {
  retry: 1,
  staleTime: 5 * 60 * 1000,
});

const createDesignMutation = trpc.design.create.useMutation({
  onSuccess: (data) => {
    Alert.alert('Success', 'Design created successfully!');
  },
  onError: (error) => {
    Alert.alert('Error', `Failed to create design: ${error.message}`);
  },
});
```

## 3. TRPC Usage Patterns

### Basic Query
```typescript
const userQuery = trpc.user.useQuery("me");
// Access: userQuery.data, userQuery.isLoading, userQuery.error
```

### Query with Options
```typescript
const userQuery = trpc.user.useQuery("me", {
  retry: 3,
  staleTime: 5 * 60 * 1000,
  enabled: true,
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
});
```

### Mutation
```typescript
const createMutation = trpc.design.create.useMutation({
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

// Use it
createMutation.mutate({
  name: 'My Design',
  description: 'A beautiful design',
});
```

### Infinite Query (Pagination)
```typescript
const designsQuery = trpc.design.list.useInfiniteQuery(
  { limit: 10 },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);

// Access data
const allDesigns = designsQuery.data?.pages.flatMap(page => page.designs) || [];
```

### Query Invalidation
```typescript
const utils = trpc.useUtils();

// Invalidate specific queries
utils.design.list.invalidate();

// Or invalidate all queries
utils.invalidate();
```

## 4. Error Handling

```typescript
const userQuery = trpc.user.useQuery("me", {
  retry: (failureCount, error) => {
    if (error.data?.code === 'UNAUTHORIZED') {
      return false; // Don't retry auth errors
    }
    return failureCount < 3;
  },
  onError: (error) => {
    switch (error.data?.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        break;
      case 'FORBIDDEN':
        Alert.alert('Access Denied');
        break;
      default:
        Alert.alert('Error', 'Something went wrong');
    }
  },
});
```

## 5. Loading States

```typescript
const userQuery = trpc.user.useQuery("me");

// Different loading states
const isLoading = userQuery.isLoading; // Initial load
const isFetching = userQuery.isFetching; // Any fetch
const isRefetching = userQuery.isRefetching; // Manual refetch
const isStale = userQuery.isStale; // Data is stale
```

## 6. Custom Hooks

Create reusable hooks in a separate file:

```typescript
// hooks/useUserData.ts
export function useUserData(userId: string) {
  return trpc.user.useQuery(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// hooks/useCreateDesign.ts
export function useCreateDesign() {
  const utils = trpc.useUtils();
  
  return trpc.design.create.useMutation({
    onSuccess: () => {
      utils.design.list.invalidate();
    },
  });
}
```

## 7. Testing TRPC

Once your backend is ready, test the connection:

1. Start your backend server
2. Update the TRPC client URL in `_layout.tsx`
3. Uncomment the TRPC examples in `home.tsx`
4. Check the console for any connection errors
5. Test the mock buttons in the UI

## 8. Common Issues

### Connection Issues
- Check if backend server is running
- Verify the URL in the TRPC client
- Check network connectivity

### Type Issues
- Ensure your backend exports the correct `AppRouter` type
- Update the import in `services/trpc.ts`

### Authentication Issues
- Verify cookie handling in the headers function
- Check if authentication is properly set up on the backend

## 9. Next Steps

1. Set up your TRPC backend with the required router structure
2. Export the `AppRouter` type from your backend
3. Update the frontend imports to use the correct types
4. Test the connection and data fetching
5. Implement your specific queries and mutations

The current setup provides a solid foundation - you just need to connect it to your actual backend when it's ready!
