import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { db } from '../config/firebaseConfig';

export default function MachinesFullList() {
  const [machines, setMachines] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'machines'));
        const machineList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        machineList.sort((a, b) => Number(b.availability) - Number(a.availability));
        setMachines(machineList);
      } catch (error) {
        console.error('Error fetching machines:', error);
      }
    };

    fetchMachines();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Machine Status</Text>

          <View style={styles.machineList}>
            {machines.map(machine => (
              <View key={machine.id} style={styles.machineCard}>
                <Text style={styles.machineType}>
                  {machine.type} #{machine.machineNumber}
                </Text>
                <Text
                  style={[
                    styles.machineStatus,
                    { color: machine.availability ? 'green' : 'red' },
                  ]}
                >
                  Status: {machine.availability ? 'Available' : 'In Use'}
                </Text>
                <Text style={styles.machineLocation}>📍 {machine.location}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backHint}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  machineList: {
    marginBottom: 20,
  },
  machineCard: {
    backgroundColor: '#f2f4f8',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  machineType: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  machineStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  machineLocation: {
    fontSize: 13,
    color: '#555',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  backHint: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});
