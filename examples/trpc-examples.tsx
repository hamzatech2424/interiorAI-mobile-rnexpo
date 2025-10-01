/**
 * TRPC Usage Examples and Patterns
 * 
 * This file demonstrates various ways to use TRPC for data fetching
 * in your React Native app. Copy and adapt these patterns as needed.
 */

import { trpc } from '@/services/trpc';
import { useState } from 'react';
import { Alert } from 'react-native';

// ============================================================================
// 1. BASIC QUERIES
// ============================================================================

export function BasicQueryExample() {
  // Simple query with automatic loading, error, and data states
  const userQuery = trpc.user.useQuery("me");

  return {
    data: userQuery.data,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    refetch: userQuery.refetch,
  };
}

// ============================================================================
// 2. QUERIES WITH OPTIONS
// ============================================================================

export function QueryWithOptionsExample() {
  const userQuery = trpc.user.useQuery("me", {
    // Retry configuration
    retry: 3, // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Caching configuration
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    
    // Conditional fetching
    enabled: true, // Only run when this is true
    
    // Refetch configuration
    refetchOnWindowFocus: false, // Don't refetch when app comes to foreground
    refetchOnMount: true, // Refetch when component mounts
    
    // Success/Error callbacks
    onSuccess: (data) => {
      console.log('User data loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load user:', error);
    },
  });

  return userQuery;
}

// ============================================================================
// 3. CONDITIONAL QUERIES
// ============================================================================

export function ConditionalQueryExample() {
  const [userId, setUserId] = useState<string | null>(null);
  
  // This query only runs when userId is not null
  const userQuery = trpc.user.useQuery(userId!, {
    enabled: !!userId, // Only run when userId exists
  });

  return {
    userQuery,
    setUserId,
  };
}

// ============================================================================
// 4. DEPENDENT QUERIES
// ============================================================================

export function DependentQueriesExample() {
  // First query
  const userQuery = trpc.user.useQuery("me");
  
  // Second query depends on first query's data
  const profileQuery = trpc.user.useQuery("profile", {
    enabled: !!userQuery.data, // Only run when user data exists
  });

  // Third query depends on both previous queries
  const settingsQuery = trpc.user.useQuery("settings", {
    enabled: !!userQuery.data && !!profileQuery.data,
  });

  return {
    userQuery,
    profileQuery,
    settingsQuery,
  };
}

// ============================================================================
// 5. MUTATIONS
// ============================================================================

export function BasicMutationExample() {
  const createDesignMutation = trpc.design.create.useMutation({
    onSuccess: (data) => {
      Alert.alert('Success', 'Design created successfully!');
      console.log('Created design:', data);
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to create design: ${error.message}`);
      console.error('Design creation error:', error);
    },
  });

  const handleCreateDesign = () => {
    createDesignMutation.mutate({
      name: 'My New Design',
      description: 'A beautiful interior design',
      roomType: 'living-room',
    });
  };

  return {
    createDesign: handleCreateDesign,
    isLoading: createDesignMutation.isLoading,
    error: createDesignMutation.error,
  };
}

// ============================================================================
// 6. MUTATIONS WITH OPTIMISTIC UPDATES
// ============================================================================

export function OptimisticMutationExample() {
  const userQuery = trpc.user.useQuery("me");
  
  const updateUserMutation = trpc.user.update.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await userQuery.cancel();
      
      // Snapshot previous value
      const previousUser = userQuery.data;
      
      // Optimistically update
      userQuery.setData(previousUser);
      
      return { previousUser };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      userQuery.setData(context?.previousUser);
    },
    onSettled: () => {
      // Refetch after error or success
      userQuery.refetch();
    },
  });

  return {
    updateUser: updateUserMutation.mutate,
    isLoading: updateUserMutation.isLoading,
  };
}

// ============================================================================
// 7. INFINITE QUERIES (PAGINATION)
// ============================================================================

export function InfiniteQueryExample() {
  const designsQuery = trpc.design.list.useInfiniteQuery(
    { limit: 10 }, // Initial query parameters
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage.prevCursor,
    }
  );

  const loadMore = () => {
    if (designsQuery.hasNextPage && !designsQuery.isFetchingNextPage) {
      designsQuery.fetchNextPage();
    }
  };

  const loadPrevious = () => {
    if (designsQuery.hasPreviousPage && !designsQuery.isFetchingPreviousPage) {
      designsQuery.fetchPreviousPage();
    }
  };

  return {
    designs: designsQuery.data?.pages.flatMap(page => page.designs) || [],
    loadMore,
    loadPrevious,
    hasNextPage: designsQuery.hasNextPage,
    hasPreviousPage: designsQuery.hasPreviousPage,
    isLoading: designsQuery.isLoading,
    isFetchingNextPage: designsQuery.isFetchingNextPage,
    isFetchingPreviousPage: designsQuery.isFetchingPreviousPage,
  };
}

// ============================================================================
// 8. QUERY INVALIDATION
// ============================================================================

export function QueryInvalidationExample() {
  const utils = trpc.useUtils();
  
  const createDesignMutation = trpc.design.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch all design-related queries
      utils.design.list.invalidate();
      utils.design.get.invalidate();
      
      // Or invalidate specific queries
      utils.design.list.setInfiniteData({ limit: 10 }, undefined);
    },
  });

  return {
    createDesign: createDesignMutation.mutate,
    isLoading: createDesignMutation.isLoading,
  };
}

// ============================================================================
// 9. MANUAL QUERY EXECUTION
// ============================================================================

export function ManualQueryExample() {
  const utils = trpc.useUtils();
  
  const fetchUserData = async (userId: string) => {
    try {
      // Manually fetch data
      const userData = await utils.user.get.fetch(userId);
      console.log('User data:', userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  };

  const prefetchUserData = async (userId: string) => {
    // Prefetch data for better UX
    await utils.user.get.prefetch(userId);
  };

  return {
    fetchUserData,
    prefetchUserData,
  };
}

// ============================================================================
// 10. ERROR HANDLING PATTERNS
// ============================================================================

export function ErrorHandlingExample() {
  const userQuery = trpc.user.useQuery("me", {
    retry: (failureCount, error) => {
      // Custom retry logic
      if (error.data?.code === 'UNAUTHORIZED') {
        return false; // Don't retry on auth errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
    onError: (error) => {
      // Handle different error types
      switch (error.data?.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          console.log('User not authenticated');
          break;
        case 'FORBIDDEN':
          // Show access denied message
          Alert.alert('Access Denied', 'You do not have permission to access this data.');
          break;
        case 'NOT_FOUND':
          // Handle not found
          Alert.alert('Not Found', 'The requested data was not found.');
          break;
        default:
          // Generic error handling
          Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    },
  });

  return userQuery;
}

// ============================================================================
// 11. LOADING STATES
// ============================================================================

export function LoadingStatesExample() {
  const userQuery = trpc.user.useQuery("me");
  
  // Different loading states
  const isLoading = userQuery.isLoading; // Initial load
  const isFetching = userQuery.isFetching; // Any fetch (including refetch)
  const isRefetching = userQuery.isRefetching; // Manual refetch
  const isStale = userQuery.isStale; // Data is stale
  
  return {
    data: userQuery.data,
    isLoading,
    isFetching,
    isRefetching,
    isStale,
    error: userQuery.error,
  };
}

// ============================================================================
// 12. CUSTOM HOOKS
// ============================================================================

export function useUserData(userId: string) {
  return trpc.user.useQuery(userId, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDesign() {
  const utils = trpc.useUtils();
  
  return trpc.design.create.useMutation({
    onSuccess: () => {
      utils.design.list.invalidate();
    },
  });
}

export function useDesignsList(limit: number = 10) {
  return trpc.design.list.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
}
