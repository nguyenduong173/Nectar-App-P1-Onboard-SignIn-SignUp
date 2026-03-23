import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const SCREENS = {
  splash: 'splash',
  onboarding: 'onboarding',
  signIn: 'signIn',
  number: 'number',
  verification: 'verification',
  location: 'location',
  login: 'login',
  signUp: 'signUp',
};

const SPLASH_DURATION_MS = 2200;

const COLORS = {
  primary: '#53B175',
  primaryMuted: '#7CC98A',
  primaryDark: '#3E9A5F',
  text: '#181725',
  textSoft: '#7C7C7C',
  textFaint: '#B1B1B1',
  border: '#E2E2E2',
  surface: '#F7F8FA',
  white: '#FFFFFF',
  blue: '#5383EC',
  navy: '#4A66AC',
  peach: '#FFF1EA',
  sky: '#EEF7FF',
  lavender: '#F3EEFF',
  appBg: '#EEF3EE',
};

const ASSETS = {
  logoWhite: require('./assets/nectar/logo-white.png'),
  carrot: require('./assets/nectar/carrot.png'),
  heroGroceries: require('./assets/nectar/hero-groceries.png'),
  locationIllustration: require('./assets/nectar/location-illustration.png'),
  onboardingPortrait: require('./img/8140 1.png'),
};

const INITIAL_FORM = {
  phone: '',
  code: '',
  zone: 'Banasree',
  area: 'Types of your area',
  loginEmail: 'info@nhtro97gmail.com',
  loginPassword: '',
  signUpName: 'Afsar Hossain Shuvo',
  signUpEmail: 'info@nhtro97gmail.com',
  signUpPassword: '',
};

export default function App() {
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState(SCREENS.onboarding);
  const [showBootSplash, setShowBootSplash] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  useEffect(() => {
    setShowBootSplash(true);
    setScreen(SCREENS.onboarding);

    const timeoutId = setTimeout(() => {
      setShowBootSplash(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const showNotice = (title, message) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  };

  const goToVerification = () => {
    if (form.phone.trim().length < 7) {
      showNotice('Mobile number', 'Please enter a valid phone number to continue.');
      return;
    }

    setScreen(SCREENS.verification);
  };

  const goToLocation = () => {
    if (form.code.trim().length !== 4) {
      showNotice('Verification code', 'Enter the 4-digit code before moving on.');
      return;
    }

    setScreen(SCREENS.location);
  };

  const submitLogin = () => {
    if (!form.loginEmail.trim() || !form.loginPassword.trim()) {
      showNotice('Login', 'Please enter both your email and password.');
      return;
    }

    showNotice('Welcome back', 'The login screen is ready. You can connect it to your API next.');
  };

  const submitSignUp = () => {
    if (!form.signUpName.trim() || !form.signUpEmail.trim() || !form.signUpPassword.trim()) {
      showNotice('Sign up', 'Please complete all fields before continuing.');
      return;
    }

    setForm((current) => ({
      ...current,
      loginEmail: current.signUpEmail,
      loginPassword: '',
    }));
    setScreen(SCREENS.login);
    showNotice('Account created', 'The sign-up screen is ready. I also prefilled your login email.');
  };

  let content = showBootSplash ? <SplashScreen /> : null;

  if (!showBootSplash) {
    switch (screen) {
      case SCREENS.splash:
        content = <SplashScreen />;
        break;
      case SCREENS.onboarding:
        content = <OnboardingScreen onStart={() => setScreen(SCREENS.signIn)} />;
        break;
      case SCREENS.signIn:
        content = (
          <SignInScreen
            onPhone={() => setScreen(SCREENS.number)}
            onSocialPress={(provider) =>
              showNotice(provider, `This button is styled and ready for your ${provider} auth flow.`)
            }
          />
        );
        break;
      case SCREENS.number:
        content = (
          <NumberScreen
            phone={form.phone}
            onBack={() => setScreen(SCREENS.signIn)}
            onChangePhone={(value) => updateField('phone', value.replace(/[^0-9]/g, ''))}
            onNext={goToVerification}
          />
        );
        break;
      case SCREENS.verification:
        content = (
          <VerificationScreen
            code={form.code}
            onBack={() => setScreen(SCREENS.number)}
            onChangeCode={(value) => updateField('code', value.replace(/[^0-9]/g, '').slice(0, 4))}
            onNext={goToLocation}
          />
        );
        break;
      case SCREENS.location:
        content = (
          <LocationScreen
            zone={form.zone}
            area={form.area}
            onBack={() => setScreen(SCREENS.verification)}
            onChangeZone={(value) => updateField('zone', value)}
            onChangeArea={(value) => updateField('area', value)}
            onSubmit={() => setScreen(SCREENS.login)}
          />
        );
        break;
      case SCREENS.login:
        content = (
          <LoginScreen
            email={form.loginEmail}
            password={form.loginPassword}
            onChangeEmail={(value) => updateField('loginEmail', value)}
            onChangePassword={(value) => updateField('loginPassword', value)}
            onSubmit={submitLogin}
            onSwitchToSignUp={() => setScreen(SCREENS.signUp)}
            showPassword={showLoginPassword}
            onTogglePassword={() => setShowLoginPassword((current) => !current)}
          />
        );
        break;
      case SCREENS.signUp:
        content = (
          <SignUpScreen
            name={form.signUpName}
            email={form.signUpEmail}
            password={form.signUpPassword}
            onChangeName={(value) => updateField('signUpName', value)}
            onChangeEmail={(value) => updateField('signUpEmail', value)}
            onChangePassword={(value) => updateField('signUpPassword', value)}
            onSubmit={submitSignUp}
            onSwitchToLogin={() => setScreen(SCREENS.login)}
            showPassword={showSignUpPassword}
            onTogglePassword={() => setShowSignUpPassword((current) => !current)}
          />
        );
        break;
      default:
        content = <OnboardingScreen onStart={() => setScreen(SCREENS.signIn)} />;
    }
  }

  return (
    <View style={styles.appBackground}>
      <StatusBar style={screen === SCREENS.splash || screen === SCREENS.onboarding ? 'light' : 'dark'} />
      <View style={[styles.deviceFrame, width >= 520 && styles.deviceFrameDesktop]}>{content}</View>
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splashScreen}>
      <Image source={ASSETS.logoWhite} style={styles.splashLogo} resizeMode="contain" />
    </View>
  );
}

function OnboardingScreen({ onStart }) {
  return (
    <ImageBackground
      source={ASSETS.onboardingPortrait}
      style={styles.onboardingScreen}
      imageStyle={styles.onboardingImage}
    >
      <View style={styles.onboardingOverlay} />
      <SafeAreaView style={styles.flex}>
        <View style={styles.onboardingContent}>
          <Image source={ASSETS.carrot} style={styles.onboardingBadge} resizeMode="contain" />
          <Text style={styles.onboardingTitle}>Welcome to our store</Text>
          <Text style={styles.onboardingSubtitle}>Get your groceries in as fast as one hour</Text>
          <PrimaryButton title="Get Started" onPress={onStart} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function SignInScreen({ onPhone, onSocialPress }) {
  return (
    <View style={styles.screenBase}>
      <Image source={ASSETS.heroGroceries} style={styles.signInHero} resizeMode="cover" />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.signInScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.signInCard}>
              <Image source={ASSETS.carrot} style={styles.brandIcon} resizeMode="contain" />
              <Text style={styles.mainTitle}>Get your groceries with nectar</Text>
              <Pressable onPress={onPhone} style={({ pressed }) => [styles.countryPicker, pressed && styles.pressed]}>
                <View style={styles.countryLeft}>
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagBadgeText}>BD</Text>
                  </View>
                  <Text style={styles.countryCode}>+880</Text>
                </View>
                <Feather name="chevron-right" size={18} color={COLORS.textSoft} />
              </Pressable>
              <Text style={styles.socialHelper}>Or connect with social media</Text>
              <SocialButton
                title="Continue with Google"
                icon={<FontAwesome name="google" size={20} color={COLORS.white} />}
                backgroundColor={COLORS.blue}
                onPress={() => onSocialPress('Google')}
              />
              <SocialButton
                title="Continue with Facebook"
                icon={<FontAwesome name="facebook" size={20} color={COLORS.white} />}
                backgroundColor={COLORS.navy}
                onPress={() => onSocialPress('Facebook')}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function NumberScreen({ phone, onBack, onChangePhone, onNext }) {
  return (
    <View style={styles.formScreen}>
      <PastelBackdrop />
      <Image source={ASSETS.heroGroceries} style={styles.formHeroBanner} resizeMode="cover" />
      <SafeAreaView style={styles.flex}>
        <BackButton onPress={onBack} onHero />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.heroFormScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Enter your mobile number</Text>
            <UnderlineInput
              label="Mobile Number"
              prefix="+880"
              value={phone}
              onChangeText={onChangePhone}
              keyboardType="number-pad"
              placeholder="1712345678"
              maxLength={10}
            />
            <View style={styles.arrowButtonRow}>
              <RoundArrowButton onPress={onNext} disabled={phone.trim().length < 7} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function VerificationScreen({ code, onBack, onChangeCode, onNext }) {
  return (
    <View style={styles.formScreen}>
      <PastelBackdrop />
      <Image source={ASSETS.heroGroceries} style={styles.formHeroBanner} resizeMode="cover" />
      <SafeAreaView style={styles.flex}>
        <BackButton onPress={onBack} onHero />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.heroFormScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Enter your 4-digit code</Text>
            <UnderlineInput
              label="Code"
              value={code}
              onChangeText={onChangeCode}
              keyboardType="number-pad"
              placeholder="- - - -"
              maxLength={4}
              inputStyle={styles.codeInput}
            />
            <Pressable onPress={() => onChangeCode('')} style={({ pressed }) => [styles.inlineLinkWrap, pressed && styles.pressed]}>
              <Text style={styles.inlineLink}>Resend Code</Text>
            </Pressable>
            <View style={styles.arrowButtonRow}>
              <RoundArrowButton onPress={onNext} disabled={code.trim().length !== 4} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function LocationScreen({ zone, area, onBack, onChangeZone, onChangeArea, onSubmit }) {
  return (
    <View style={styles.formScreen}>
      <PastelBackdrop />
      <SafeAreaView style={styles.flex}>
        <BackButton onPress={onBack} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.locationScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image source={ASSETS.locationIllustration} style={styles.locationIllustration} resizeMode="contain" />
            <Text style={styles.centerTitle}>Select Your Location</Text>
            <Text style={styles.centerSubtitle}>
              {"Switch on your location to stay in tune with what's happening in your area"}
            </Text>
            <SelectionInput label="Your Zone" value={zone} onChangeText={onChangeZone} />
            <SelectionInput label="Your Area" value={area} onChangeText={onChangeArea} />
            <PrimaryButton title="Submit" onPress={onSubmit} style={styles.submitButtonSpacing} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function LoginScreen({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onSwitchToSignUp,
  showPassword,
  onTogglePassword,
}) {
  return (
    <View style={styles.formScreen}>
      <PastelBackdrop />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.accountScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image source={ASSETS.carrot} style={styles.accountIcon} resizeMode="contain" />
            <Text style={styles.formTitle}>Login</Text>
            <Text style={styles.formSubtitle}>Enter your emails and password</Text>
            <CardInput
              icon={<MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSoft} />}
              placeholder="Email"
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CardInput
              icon={<Feather name="lock" size={20} color={COLORS.textSoft} />}
              placeholder="Password"
              value={password}
              onChangeText={onChangePassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              trailing={
                <Pressable onPress={onTogglePassword} style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textSoft} />
                </Pressable>
              }
            />
            <Pressable style={({ pressed }) => [styles.forgotLinkWrap, pressed && styles.pressed]}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </Pressable>
            <PrimaryButton title="Log In" onPress={onSubmit} />
            <FooterLink prompt="Don't have an account? " action="Signup" onPress={onSwitchToSignUp} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function SignUpScreen({
  name,
  email,
  password,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onSwitchToLogin,
  showPassword,
  onTogglePassword,
}) {
  return (
    <View style={styles.formScreen}>
      <PastelBackdrop />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.accountScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image source={ASSETS.carrot} style={styles.accountIcon} resizeMode="contain" />
            <Text style={styles.formTitle}>Sign Up</Text>
            <Text style={styles.formSubtitle}>Enter your details to continue</Text>
            <CardInput
              icon={<Feather name="user" size={20} color={COLORS.textSoft} />}
              placeholder="Username"
              value={name}
              onChangeText={onChangeName}
            />
            <CardInput
              icon={<MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSoft} />}
              placeholder="Email"
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              trailing={<Feather name="check" size={18} color={COLORS.primary} />}
            />
            <CardInput
              icon={<Feather name="lock" size={20} color={COLORS.textSoft} />}
              placeholder="Password"
              value={password}
              onChangeText={onChangePassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              trailing={
                <Pressable onPress={onTogglePassword} style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textSoft} />
                </Pressable>
              }
            />
            <Text style={styles.termsCopy}>
              By continuing you agree to our <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>
            <PrimaryButton title="Sign Up" onPress={onSubmit} />
            <FooterLink prompt="Already have an account? " action="Login" onPress={onSwitchToLogin} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function PastelBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdropLayer}>
      <View style={[styles.blurOrb, styles.orbPeach]} />
      <View style={[styles.blurOrb, styles.orbSky]} />
      <View style={[styles.blurOrb, styles.orbLavender]} />
    </View>
  );
}

function BackButton({ onPress, onHero = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.backButton, onHero && styles.backButtonOnHero, pressed && styles.pressed]}
    >
      <Ionicons name="chevron-back" size={20} color={COLORS.text} />
    </Pressable>
  );
}

function PrimaryButton({ title, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed, style]}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}

function SocialButton({ title, icon, backgroundColor, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.socialButton,
        { backgroundColor },
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.socialIconWrap}>{icon}</View>
      <Text style={styles.socialButtonText}>{title}</Text>
    </Pressable>
  );
}

function RoundArrowButton({ onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.roundArrowButton,
        disabled && styles.roundArrowDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Feather name="chevron-right" size={24} color={COLORS.white} />
    </Pressable>
  );
}

function UnderlineInput({
  label,
  prefix,
  value,
  onChangeText,
  keyboardType,
  placeholder,
  maxLength,
  inputStyle,
}) {
  return (
    <View style={styles.underlineBlock}>
      <Text style={styles.underlineLabel}>{label}</Text>
      <View style={styles.underlineField}>
        {prefix ? <Text style={styles.underlinePrefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.underlineInput, inputStyle]}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textFaint}
          maxLength={maxLength}
          selectionColor={COLORS.primary}
        />
      </View>
    </View>
  );
}

function SelectionInput({ label, value, onChangeText }) {
  return (
    <View style={styles.selectionBlock}>
      <Text style={styles.selectionLabel}>{label}</Text>
      <View style={styles.selectionField}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.selectionInput}
          placeholderTextColor={COLORS.textFaint}
          selectionColor={COLORS.primary}
        />
        <Ionicons name="chevron-down" size={18} color={COLORS.textSoft} />
      </View>
    </View>
  );
}

function CardInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'sentences',
  trailing,
}) {
  return (
    <View style={styles.cardInput}>
      <View style={styles.cardIconWrap}>{icon}</View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.cardTextInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textFaint}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectionColor={COLORS.primary}
      />
      {trailing ? <View style={styles.cardTrailing}>{trailing}</View> : null}
    </View>
  );
}

function FooterLink({ prompt, action, onPress }) {
  return (
    <Text style={styles.footerCopy}>
      {prompt}
      <Text onPress={onPress} style={styles.footerAction}>
        {action}
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: COLORS.appBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  deviceFrameDesktop: {
    maxHeight: 920,
    borderRadius: 34,
    shadowColor: '#203229',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 12,
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
  },
  screenBase: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  splashScreen: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 210,
    height: 54,
  },
  onboardingScreen: {
    flex: 1,
    backgroundColor: '#274C3A',
  },
  onboardingImage: {
    opacity: 1,
  },
  onboardingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  onboardingBadge: {
    width: 44,
    height: 54,
    marginBottom: 26,
    tintColor: COLORS.white,
  },
  onboardingTitle: {
    color: COLORS.white,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    maxWidth: 270,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    marginTop: 10,
    marginBottom: 36,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 270,
  },
  primaryButton: {
    width: '100%',
    minHeight: 66,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  signInHero: {
    width: '100%',
    height: 330,
  },
  signInScroll: {
    flexGrow: 1,
    marginTop: -42,
    paddingBottom: 30,
  },
  signInCard: {
    flexGrow: 1,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    backgroundColor: COLORS.white,
    paddingHorizontal: 26,
    paddingTop: 34,
    paddingBottom: 34,
  },
  brandIcon: {
    width: 40,
    height: 48,
    alignSelf: 'center',
    marginBottom: 26,
  },
  mainTitle: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '700',
    marginBottom: 28,
    maxWidth: 260,
  },
  countryPicker: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagBadge: {
    minWidth: 34,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#E8F6ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  countryCode: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  socialHelper: {
    color: COLORS.textSoft,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButton: {
    minHeight: 66,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  socialIconWrap: {
    position: 'absolute',
    left: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  formScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.6,
  },
  orbPeach: {
    top: -70,
    right: -40,
    backgroundColor: COLORS.peach,
  },
  orbSky: {
    top: 90,
    right: 70,
    backgroundColor: COLORS.sky,
  },
  orbLavender: {
    bottom: -85,
    left: -60,
    backgroundColor: COLORS.lavender,
  },
  formHeroBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 0,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.86)',
  },
  backButtonOnHero: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  heroFormScroll: {
    flexGrow: 1,
    paddingTop: 225,
    paddingHorizontal: 26,
    paddingBottom: 34,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 12,
  },
  formSubtitle: {
    color: COLORS.textSoft,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
  },
  underlineBlock: {
    marginTop: 20,
  },
  underlineLabel: {
    color: COLORS.textSoft,
    fontSize: 15,
    marginBottom: 12,
  },
  underlineField: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  underlinePrefix: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  underlineInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    paddingVertical: 12,
  },
  codeInput: {
    letterSpacing: 10,
  },
  inlineLinkWrap: {
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  inlineLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  arrowButtonRow: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingTop: 32,
  },
  roundArrowButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  roundArrowDisabled: {
    backgroundColor: COLORS.primaryMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  locationScroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 36,
    paddingBottom: 34,
  },
  locationIllustration: {
    width: 172,
    height: 140,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 22,
  },
  centerTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  centerSubtitle: {
    color: COLORS.textSoft,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 18,
  },
  selectionBlock: {
    marginBottom: 18,
  },
  selectionLabel: {
    color: COLORS.textSoft,
    fontSize: 15,
    marginBottom: 10,
  },
  selectionField: {
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingLeft: 16,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 12,
    marginRight: 10,
  },
  submitButtonSpacing: {
    marginTop: 14,
  },
  accountScroll: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 48,
    paddingBottom: 34,
  },
  accountIcon: {
    width: 46,
    height: 54,
    alignSelf: 'center',
    marginBottom: 26,
  },
  cardInput: {
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconWrap: {
    width: 28,
    alignItems: 'flex-start',
  },
  cardTextInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  cardTrailing: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeButton: {
    padding: 4,
  },
  forgotLinkWrap: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 28,
  },
  forgotLink: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  footerCopy: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 14,
    marginTop: 22,
  },
  footerAction: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  termsCopy: {
    color: COLORS.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
    marginBottom: 26,
  },
  termsHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
