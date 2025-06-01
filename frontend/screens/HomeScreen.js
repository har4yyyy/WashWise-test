import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebaseConfig';

const auth = getAuth();

export default function HomeScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [machines, setMachines] = useState([]);
  const router = useRouter();

  // 监听登录状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, []);

  // 登出处理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out');
    } catch (error) {
      Alert.alert('Logout error', error.message);
    }
  };

  // 获取洗衣机列表
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'machines'));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (b.availability === true) - (a.availability === true));
        setMachines(list);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchMachines();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>🎉 Welcome to WashWise @NUS, {userEmail}</Text>

      {/* Machine Availability Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧺 Machine Availability</Text>

        <View style={styles.machineList}>
          <ScrollView contentContainerStyle={styles.listContainer}>
            {machines.slice(0, 3).map(machine => (
              <View key={machine.id} style={styles.machineCard}>
                <Text style={styles.machineType}>Type: {machine.type}</Text>
                <Text style={styles.machineStatus}>
                  Status: {machine.availability ? '✅ Available' : '❌ In Use'}
                </Text>
                <Text style={styles.machineLocation}>Location: {machine.location}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => router.push('/machinesFullList')}>
            <Text style={styles.tapHint}>👀 View All Machines →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity onPress={() => router.push('/myLaundry')} style={styles.button}>
          <Text style={styles.buttonText}>My Laundry</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/rewards')} style={styles.button}>
          <Text style={styles.buttonText}>Points & Rewards</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f8',
  },
  welcome: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
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
  listContainer: {
    paddingBottom: 20,
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
    marginTop: 10,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  navButtons: {
    marginTop: 10,
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
  logoutButton: {
    padding: 14,
    backgroundColor: '#D9534F',
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
