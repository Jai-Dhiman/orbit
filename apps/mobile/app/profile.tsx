import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useAuthStore } from 'packages/core/src/state/authStore';
import { useRouter } from 'expo-router';
import { colors } from 'packages/ui/styles/colors'; // Assuming colors are available

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

export default function ProfileScreen() {
  const { user, clearAuth, getRefreshToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true); // You might want to add a loading state to the store or local state here
    const refreshToken = getRefreshToken(); // Get refresh token to invalidate on server

    try {
      // Optional: Call the server's /logout endpoint
      // This is good practice to invalidate the refresh token on the server side if possible.
      if (refreshToken) {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!response.ok) {
          // Log error but proceed with client-side logout anyway
          console.warn('Server logout failed, proceeding with client-side logout.');
        }
      }
    } catch (error) {
      console.error('Error during server logout:', error);
      // Still proceed with client-side logout
    } finally {
      clearAuth(); // Clear local auth state
      // setLoading(false);
      // Navigation to login screen is handled by the RootLayout's AuthNavigator
      // router.replace('/login'); // This might not be strictly necessary if RootLayout handles it
    }
  };

  // Temporary setLoading function until it's potentially added to store or handled better
  const setLoading = (isLoading: boolean) => {
    // console.log("Loading state would be:", isLoading);
    // In a real app, you'd use a state variable for this
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user?.picture ? (
        <Image source={{ uri: user.picture }} style={styles.profileImage} />
      ) : (
        <View style={styles.profileImagePlaceholder} />
      )}

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user?.name || 'Not set'}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user?.email || 'Not set'}</Text>

      {user?.profileExists === false && (
        <Text style={styles.notice}>Please complete your profile information.</Text>
      )}
      {useAuthStore.getState().isNewUser === true && (
        <Text style={styles.notice}>
          Welcome! This is your profile page. More settings coming soon.
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', onPress: handleLogout, style: 'destructive' },
            ]);
          }}
          color={colors.danger} // Assuming a danger color for logout
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: colors.background, // Assuming background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text, // Assuming text color
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: colors.textSecondary, // Placeholder color
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#cccccc', // A generic placeholder color
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: colors.textSecondary, // Assuming secondary text color
    alignSelf: 'flex-start',
    width: '90%', // Ensure labels take up width for alignment
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.text,
    alignSelf: 'flex-start',
    width: '90%',
  },
  notice: {
    marginTop: 20,
    fontSize: 16,
    color: colors.primary, // Using primary color for notice, or choose another
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
});
