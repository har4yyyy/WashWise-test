import { View, Text, FlatList, StyleSheet, Image, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // 两列，每边 padding 16，中间 spacing 16

const mockPosts = [
  {
    id: '1',
    user: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=32',
    image: 'https://source.unsplash.com/400x300/?laundry',
    caption: 'Washed clothes at Blk 29. Super clean!',
  },
  {
    id: '2',
    user: 'Ben',
    avatar: 'https://i.pravatar.cc/150?img=45',
    image: 'https://source.unsplash.com/400x300/?dryer',
    caption: 'New dryer works fast!',
  },
  {
    id: '3',
    user: 'Cindy',
    avatar: 'https://i.pravatar.cc/150?img=23',
    image: 'https://source.unsplash.com/400x300/?washingmachine',
    caption: 'Evening laundry routine 🍃',
  },
  {
    id: '4',
    user: 'David',
    avatar: 'https://i.pravatar.cc/150?img=14',
    image: 'https://source.unsplash.com/400x300/?cleaning',
    caption: 'Laundry vibes ✨',
  },
  {
    id: '5',
    user: 'Eva',
    avatar: 'https://i.pravatar.cc/150?img=19',
    image: 'https://source.unsplash.com/400x300/?clothes',
    caption: 'Soft and fresh!',
  },
];

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 WashWise Community</Text>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.captionBox}>
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption}
              </Text>
              <View style={styles.userRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.username}>{item.user}</Text>
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
  },
  captionBox: {
    padding: 8,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  username: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});
