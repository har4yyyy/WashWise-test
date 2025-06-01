import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
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

  // ✅ 实时监听 Firestore 中 machines 的变动
  useEffect(() => {
    const unsubscribeMachines = onSnapshot(collection(db, 'machines'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.availability === true) - (a.availability === true));
      setMachines(list);
    });

    return unsubscribeMachines;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out');
    } catch (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>
          Welcome to WashWise@NUS{userEmail ? `\n${userEmail}` : ''}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Machine Availability</Text>

          <View style={styles.machineList}>
            <ScrollView contentContainerStyle={styles.listContainer}>
              {machines.slice(0, 3).map((machine) => (
                <View key={machine.id} style={styles.machineCard}>
                  <Text style={styles.machineType}>{machine.type}</Text>
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
            </ScrollView>

            <TouchableOpacity onPress={() => router.push('/machinesFullList')}>
              <Text style={styles.tapHint}>View All →</Text>
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

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    color: 'grey',
  },
  section: {
    marginBottom: 20,
  },
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
  tapHint: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    alignSelf: 'center',
    width: 150,
  },
});
