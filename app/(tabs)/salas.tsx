import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSalas, Sala } from '@/hooks/useSalas';

export default function SalasScreen() {
  const { salas, loading, error, serverStatus, loadSalas } = useSalas();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSalas();
    setRefreshing(false);
  };

  const handleReservar = (sala: Sala) => {
    Alert.alert(
      'Reservar Sala',
      `¿Deseas reservar la ${sala.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reservar', onPress: () => {
          Alert.alert('Éxito', `Reserva para ${sala.nombre} confirmada`);
        }}
      ]
    );
  };

  const renderSala = ({ item }: { item: Sala }) => (
    <View style={styles.salaCard}>
      <Image source={{ uri: item.imagen }} style={styles.salaImage} />
      <View style={styles.salaContent}>
        <View style={styles.salaHeader}>
          <Text style={styles.salaNombre}>{item.nombre}</Text>
          <View style={[styles.tipoBadge, { backgroundColor: getTipoColor(item.tipo) }]}>
            <Text style={styles.tipoText}>{item.tipo}</Text>
          </View>
        </View>
        
        <Text style={styles.salaDescripcion}>{item.descripcion}</Text>
        
        <View style={styles.salaFooter}>
          <Text style={styles.capacidadText}>Capacidad: {item.capacidad} personas</Text>
          <TouchableOpacity
            style={[styles.reservarBtn, !item.disponible && styles.reservarBtnDisabled]}
            onPress={() => handleReservar(item)}
            disabled={!item.disponible}
          >
            <Text style={styles.reservarBtnText}>
              {item.disponible ? 'Reservar' : 'No disponible'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      'Corporate': '#3B82F6',
      'Cognata': '#10B981',
      'Importe': '#F59E0B',
      'Innovate': '#8B5CF6',
      'Focus': '#EF4444'
    };
    return colors[tipo] || '#6B7280';
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Cargando salas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadSalas}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Salas de Mentoría</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: serverStatus ? '#10B981' : '#EF4444' }]} />
          <Text style={styles.statusText}>
            {serverStatus ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>

      <FlatList
        data={salas}
        renderItem={renderSala}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  salaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  salaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  salaContent: {
    padding: 16,
  },
  salaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  salaNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    flex: 1,
  },
  tipoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  tipoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  salaDescripcion: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  salaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacidadText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  reservarBtn: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reservarBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  reservarBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
