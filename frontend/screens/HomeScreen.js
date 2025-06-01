import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { db } from '../config/firebaseConfig';

const auth = getAuth();

export default function HomeScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [machines, setMachines] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
      else router.replace('/login');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'machines'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (b.availability === true) - (a.availability === true));
        setMachines(list);
      } catch (err) {
        console.error('Error fetching machines:', err);
        Alert.alert('Error loading machines');
      }
    };
    fetchMachines();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to WashWise @NUS{userEmail ? `\n${userEmail}` : ''}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧺 Machines Availability</Text>

        <View style={styles.machineList}>
          <ScrollView contentContainerStyle={styles.listContainer}>
            {machines.slice(0, 3).map((machine) => (
              <View key={machine.id} style={styles.machineCard}>
                <Text style={styles.machineType}>Type: {machine.type}</Text>
                <Text
                  style={[
                    styles.machineStatus,
                    { color: machine.availability ? 'green' : 'red' },
                  ]}
                >
                  Status: {machine.availability ? 'Available' : 'In Use'}
                </Text>
                <Text style={styles.machineLocation}>Location: {machine.location}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => router.push('/machinesFullList')}>
            <Text style={styles.tapHint}>View All Machines →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={() => router.push('/myLaundry')} style={styles.button}>
          <Text style={styles.buttonText}>My Laundry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/rewards')} style={styles.button}>
          <Text style={styles.buttonText}>Points & Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/community')} style={styles.button}>
          <Text style={styles.buttonText}>Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f4f8' },

  welcome: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    color: 'grey',
  },

  section: { marginBottom: 30 },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  machineList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    maxHeight: 250,
  },

  machineCard: {
    backgroundColor: '#e6e6e6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  machineType: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  machineStatus: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },

  machineLocation: {
    fontSize: 14,
    marginTop: 2,
    color: '#333',
  },

  tapHint: {
    fontSize: 14,
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#4682B4',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});