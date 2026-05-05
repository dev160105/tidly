import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { SunIllustration } from '../components/illustrations/SunIllustration';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Tidly',
    tagline: ['split the work,\nnot your ', 'sanity', '.'],
  },
  {
    title: 'Tidly',
    tagline: ['track chores,\nearn ', 'points', '.'],
  },
  {
    title: 'Tidly',
    tagline: ['stay on top,\nstay ', 'sane', '.'],
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [slide, setSlide] = useState(0);

  const goToApp = () => navigation.replace('Main');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={goToApp}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.illustrationWrap}>
        <SunIllustration width={width * 0.9} height={220} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Tidly</Text>

      {/* Tagline */}
      <View style={styles.taglineWrap}>
        <Text style={styles.tagline}>
          {SLIDES[slide].tagline[0]}
          <Text style={styles.taglineHighlight}>{SLIDES[slide].tagline[1]}</Text>
          {SLIDES[slide].tagline[2]}
        </Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.dot,
              i === slide ? styles.dotActive : styles.dotInactive,
            ]}
            onPress={() => setSlide(i)}
          />
        ))}
      </View>

      {/* Auth buttons */}
      <View style={styles.authSection}>
        {/* Sign in with Apple */}
        <TouchableOpacity style={styles.appleBtn} onPress={goToApp} activeOpacity={0.85}>
          <AntDesign name="apple1" size={20} color="white" />
          <Text style={styles.appleBtnText}>Sign in with Apple</Text>
        </TouchableOpacity>

        {/* Continue with Google */}
        <TouchableOpacity style={styles.googleBtn} onPress={goToApp} activeOpacity={0.85}>
          <AntDesign name="google" size={18} color="#4285F4" />
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Email link */}
        <TouchableOpacity onPress={goToApp} style={styles.emailBtn}>
          <Text style={styles.emailText}>Or continue with email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFAF5',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
  },
  skipText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  illustrationWrap: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: 'center',
  },

  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#3ECFA0',
    letterSpacing: -1.5,
    marginBottom: 12,
  },

  taglineWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 32,
  },
  taglineHighlight: {
    color: '#FF6B6B',
    fontWeight: '700',
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#3ECFA0',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D0EDE6',
  },

  authSection: {
    width: '100%',
    gap: 12,
  },

  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appleBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  googleBtnText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },

  emailBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(0,0,0,0.2)',
  },
});
