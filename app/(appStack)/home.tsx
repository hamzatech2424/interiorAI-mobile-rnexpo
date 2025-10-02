import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { borderRadius, shadows, spacing, typography } from '../../colors';
import useAuthController, { logout } from '../../controllerHooks/useAuthController';
import { useTheme } from '../../hooks/useTheme';
import { trpc } from '../../services/trpc';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { syncUser } = useAuthController();
  const [testInput, setTestInput] = useState('');

  // TRPC Backend Connection - Now connected to your backend!
  

  // Example user query (modify based on your backend)
  const userQuery = (trpc as any).user?.me?.useQuery?.(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data: any) => {
      console.log('✅ User data loaded:', data);
    },
    onError: (error: any) => {
      console.error('❌ User query failed:', error);
    },
  });

  // Example mutation (modify based on your backend)
  const createDesignMutation = (trpc as any).design?.create?.useMutation?.({
    onSuccess: (data: any) => {
      Alert.alert('Success', 'Design created successfully!');
      console.log('✅ Design created:', data);
    },
    onError: (error: any) => {
      Alert.alert('Error', `Failed to create design: ${error.message}`);
      console.error('❌ Design creation failed:', error);
    },
  });

  const createTestDesign = () => {
    if (createDesignMutation?.mutate) {
      createDesignMutation.mutate({
        name: 'Test Design',
        description: 'A test design from frontend',
        roomType: 'living-room'
      });
    } else {
      Alert.alert('Info', 'TRPC mutation not available. Check your backend setup.');
    }
  };

  const refreshUserData = () => {
    if (userQuery?.refetch) {
      userQuery.refetch();
    } else {
      Alert.alert('Info', 'TRPC query not available. Check your backend setup.');
    }
  };


  // useEffect(() => {

  //   syncUser()
  //     .then((response) => {
  //       console.log(response, "response Of API")
  //     })
  //     .catch((error) => {
  //       console.log(error, "error")
  //     })

  // }, [])

  const features = [
    {
      icon: 'camera',
      title: 'Upload Room Photo',
      description: 'Take or upload a photo of your room to get started',
    },
    {
      icon: 'color-palette',
      title: 'AI Design Suggestions',
      description: 'Get personalized interior design recommendations',
    },
    {
      icon: 'home',
      title: 'Style Variations',
      description: 'Explore different design styles and themes',
    },
    {
      icon: 'save',
      title: 'Save Favorites',
      description: 'Save your favorite designs for future reference',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isDark
            ? [colors.background, colors.surface]
            : [colors.background, colors.secondary]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <TouchableOpacity
            onPress={logout}
            style={[styles.logo, { backgroundColor: colors.primary }, shadows.md]}>
              {/* <Ionicons
                name="home"
                size={24}
                color={colors.background}
              /> */}
            </TouchableOpacity>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            InteriorAI
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            AI-Powered Interior Design
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome to InteriorAI! 🏠
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Transform your space with AI-powered interior design suggestions.
            Upload a room photo and get personalized design recommendations.
          </Text>
        </View>

        {/* TRPC Backend Connection */}
        <View style={styles.trpcSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Backend Connection
          </Text>
         

          {/* User Data Display */}
          <View style={[styles.dataCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>User Data</Text>
            {userQuery?.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading user data...
                </Text>
              </View>
            )}
            {userQuery?.error && (
              <Text style={[styles.errorText, { color: 'red' }]}>
                Error: {userQuery.error.message}
              </Text>
            )}
            {userQuery?.data && (
              <Text style={[styles.dataText, { color: colors.textSecondary }]}>
                {JSON.stringify(userQuery.data, null, 2)}
              </Text>
            )}
            {!userQuery && (
              <Text style={[styles.errorText, { color: 'orange' }]}>
                ⚠️ User query not available. Check your backend setup.
              </Text>
            )}
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: colors.primary }]}
              onPress={refreshUserData}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Refresh User Data
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mutation Example */}
          <View style={[styles.dataCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Create Design</Text>
            <TouchableOpacity
              style={[
                styles.mutationButton, 
                { 
                  backgroundColor: createDesignMutation?.isLoading ? colors.textSecondary : colors.accent 
                }
              ]}
              onPress={createTestDesign}
              disabled={createDesignMutation?.isLoading}
            >
              {createDesignMutation?.isLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Ionicons name="add" size={20} color={colors.background} />
              )}
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {createDesignMutation?.isLoading ? 'Creating...' : 'Create Test Design'}
              </Text>
            </TouchableOpacity>
            {createDesignMutation?.error && (
              <Text style={[styles.errorText, { color: 'red' }]}>
                Mutation Error: {createDesignMutation.error.message}
              </Text>
            )}
            {!createDesignMutation && (
              <Text style={[styles.errorText, { color: 'orange' }]}>
                ⚠️ Mutation not available. Check your backend setup.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Features
          </Text>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                { backgroundColor: colors.surface },
                shadows.sm
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.accent }]}>
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color={colors.background}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }, shadows.md]}
            onPress={() => {
              // TODO: Navigate to camera/upload screen
              console.log('Upload photo pressed');
            }}
          >
            <Ionicons
              name="camera"
              size={24}
              color={colors.background}
            />
            <Text style={[styles.buttonText, { color: colors.background }]}>
              Upload Room Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: 'transparent',
                borderColor: colors.primary,
                borderWidth: 2,
              }
            ]}
            onPress={() => {
              // TODO: Navigate to gallery/examples
              console.log('View examples pressed');
            }}
          >
            <Ionicons
              name="images"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              View Examples
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.normal * typography.sizes.sm,
  },
  actionSection: {
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },
  // TRPC Section Styles
  trpcSection: {
    marginBottom: spacing.xl,
  },
  dataCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: typography.sizes.sm,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  dataText: {
    fontSize: typography.sizes.xs,
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  refreshButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  mutationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  loadMoreButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
