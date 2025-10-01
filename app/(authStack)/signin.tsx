import { signIn } from '@/helper/auth-client';
import { errorToast, successToast } from '@/utils';
import { logConnectionInfo } from '@/utils/testConnection';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import { spacing, typography } from '../../colors';
import AuthHeader from '../../components/AuthHeader';
import Background from '../../components/Background';
import CustomButton from '../../components/CustomButton';
import FormInput from '../../components/FormInput';
import { useTheme } from '../../hooks/useTheme';


// Validation schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [loadingApp, setLoadingApp] = useState(false)

  const initialValues: SignInFormValues = {
    email: '',
    password: '',
  };

  const handleSignIn = async (values: SignInFormValues, { setSubmitting }: any) => {
    try {
      setLoading(true);
      const response = await signIn.email({
        email: values.email,
        password: values.password,
      })
      if (response.data) {
        successToast("Welcome back!");
        // Add a small delay for smooth transition
        setTimeout(() => {
          router.replace('/(appStack)/home');
        }, 500);
      }
      else {
        errorToast(response.error.message);
      }
      console.log(response, "response");
    } catch (error) {
      errorToast(error)
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    Alert.alert('Forgot Password', 'Forgot password functionality will be implemented soon.');
  };

  const handleSignUp = () => {
    router.push('/(authStack)/signup');
  };

  const handleAppLogin = async () => {
    try {
      setLoadingApp(true)

      // Log connection info for debugging
      logConnectionInfo();
      console.log('🍎 Starting Apple Sign In...')

      const data = await signIn.social({
        provider: "apple"
      })

      console.log('📦 Apple Sign In Response:', data)

      // if (data.data) {
      //   successToast("Welcome back!");
      //   // Add a small delay for smooth transition
      //   setTimeout(() => {
      //     router.replace('/(appStack)/home');
      //   }, 500);
      // }
      // else if (data.error) {
      //   console.error('❌ Apple Sign In Error:', data.error)
      //   errorToast(data.error.message || 'Apple Sign In failed');
      // }
    } catch (error: any) {
      console.error('❌ Apple Sign In Exception:', error)

      // Provide more helpful error messages
      if (error.message?.includes('Network request failed')) {
        errorToast('Network error: Cannot connect to server. Check your backend connection.');
      } else if (error.message?.includes('timeout')) {
        errorToast('Request timeout: Server is taking too long to respond.');
      } else {
        errorToast(error.message || 'An unexpected error occurred during Apple Sign In');
      }
    } finally {
      setLoadingApp(false)
    }
  };

  return (
    <Background>
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to continue your design journey"
        showBackButton={false}
      />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={handleSignIn}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <FormInput
                label="Email Address"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail"
              />

              <FormInput
                label="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                secureTextEntry={!showPassword}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                icon="lock-closed"
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <CustomButton
                title="Sign In"
                onPress={handleSubmit}
                loading={loading}
              />

              {/* <CustomButton
                title="App Login"
                onPress={handleAppLogin}
                loading={loadingApp}
              /> */}

              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={12}
                style={{ height: 56, width: "88%", alignSelf: "center" }}
                onPress={async () => {
                  try {
                    const credential = await AppleAuthentication.signInAsync({
                      requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                      ],
                    });

                    if (!credential.identityToken) {
                      throw new Error("No identity token returned from Apple");
                    }

                    console.log("🍎 Starting Apple Sign In...", credential);
                    const data = await signIn.social({
                      provider: "apple",
                      idToken: { token: credential.identityToken },
                    });
                    console.log("✅ Signed in with Better Auth", data);
                    if (data.data) {
                      successToast("Welcome back!");
                      setTimeout(() => {
                        router.replace('/(appStack)/home');
                      }, 500);
                    }
                    else if (data.error) {
                      errorToast(data.error.message || 'Apple Sign In failed');
                    }
                  } catch (e: any) {
                    if (e?.code === "ERR_REQUEST_CANCELED") {
                      console.log("❌ User canceled Apple Sign In");
                    } else {
                      console.error("❌ Apple Sign In error:", e);
                    }
                  }
                }}
              />

              <View style={{ height: 20 }} />
              <View style={styles.signUpContainer}>
                <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={[styles.signUpLink, { color: colors.accent }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  form: {
    flex: 1,
    marginTop: 25,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginHorizontal: spacing.md,
  },
  socialButton: {
    marginBottom: spacing.xl,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: typography.sizes.base,
  },
  signUpLink: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
