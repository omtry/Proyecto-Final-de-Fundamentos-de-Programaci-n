import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Bookey</Text>
        <Text style={styles.heroSubtitle}>El espacio reservado al alcance de tus manos</Text>
        <Text style={styles.heroDescription}>
          Encuentra el ambiente perfecto para tus sesiones de aprendizaje y colaboración
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>¿Cómo funciona Bookey?</Text>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>📅</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Reservar Sala</Text>
            <Text style={styles.featureDescription}>
              Encuentra y reserva la sala perfecta para tus necesidades. Filtra por capacidad, equipamiento y disponibilidad.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>👀</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Ver Disponibilidad</Text>
            <Text style={styles.featureDescription}>
              Consulta en tiempo real la disponibilidad de todas nuestras salas y agenda tu sesión al instante.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>🔐</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Solicitar Permisos</Text>
            <Text style={styles.featureDescription}>
              Gestiona permisos especiales y accesos para eventos o sesiones que requieran configuraciones específicas.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.featureEmoji}>📱</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Gestión Sencilla</Text>
            <Text style={styles.featureDescription}>
              Administra todas tus reservas desde un solo lugar. Modifica, cancela o consulta tu historial fácilmente.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <Link href="/(tabs)/salas" asChild>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Ver Salas Disponibles</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  hero: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E6F0FF',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ctaContainer: {
    padding: 24,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
