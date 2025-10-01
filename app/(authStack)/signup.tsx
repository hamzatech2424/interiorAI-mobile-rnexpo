import { signUp } from '@/helper/auth-client';
import { errorToast, successToast } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
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
const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the Terms and Conditions'),
});

interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignUpScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues: SignUpFormValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };

  const handleSignUp = async (values: SignUpFormValues, { setSubmitting }: any) => {
    try {
      setLoading(true);
      const response = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
      })
      if (response.data) {
        successToast("Account created successfully")
        router.push('/(authStack)/signin')
      }
      else {
        errorToast(response.error.message)
      }

    } catch (error) {
      errorToast(error)
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(authStack)/signin');
  };

  const handleTermsPress = () => {
    // TODO: Navigate to terms and conditions
    Alert.alert('Terms and Conditions', 'Terms and conditions will be displayed here.');
  };

  return (
    <Background>
      <AuthHeader
        title="Create Account"
        subtitle="Join InteriorAI and transform your space with AI-powered design"
        showBackButton={true}
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
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
            <View style={styles.form}>
              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={errors.fullName}
                touched={touched.fullName}
                autoCapitalize="words"
                icon="person"
              />

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
                placeholder="Create a password"
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

              <FormInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle={true}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                icon="lock-closed"
              />

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setFieldValue('agreeToTerms', !values.agreeToTerms)}
              >
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: values.agreeToTerms ? colors.accent : 'transparent',
                    borderColor: values.agreeToTerms ? colors.accent : colors.border,
                  }
                ]}>
                  {values.agreeToTerms && (
                    <Ionicons name="checkmark" size={16} color={colors.background} />
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                    I agree to the{' '}
                  </Text>
                  <TouchableOpacity onPress={handleTermsPress}>
                    <Text style={[styles.termsLink, { color: colors.accent }]}>
                      Terms and Conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {errors.agreeToTerms && touched.agreeToTerms && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.agreeToTerms}
                </Text>
              )}

              <CustomButton
                title="Create Account"
                onPress={handleSubmit}
                loading={loading}
                variant="primary"
                style={styles.signUpButton}
              />


              <View style={styles.signInContainer}>
                <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignIn}>
                  <Text style={[styles.signInLink, { color: colors.accent }]}>
                    Sign In
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
    justifyContent: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsText: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.normal * typography.sizes.sm,
  },
  termsLink: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
  },
  signUpButton: {
    marginBottom: spacing.lg,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: typography.sizes.base,
  },
  signInLink: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
