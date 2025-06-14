import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Search, Plus } from 'lucide-react-native';
import { lightColors, darkColors } from '@arden/ui/styles/colors';
import { useNotes, useToggleNoteFavorite, useUpdateNote } from '@arden/core/hooks';
import { useNotesStore } from '@arden/core/state';
import { NoteCard } from '@/src/components/NoteCard';

export default function NotesScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const styles = getStyles(colors);

  // Zustand store for client state
  const { searchQuery, showArchived, showFavorites, setSearchQuery, getQueryParams } =
    useNotesStore();

  // TanStack Query for server state
  const { data: notesData, isLoading, error } = useNotes(getQueryParams());
  const toggleFavoriteMutation = useToggleNoteFavorite();
  const updateNoteMutation = useUpdateNote();

  const handleToggleFavorite = (noteId: string, currentFavorite: boolean) => {
    toggleFavoriteMutation.mutate({
      id: noteId,
      favorite: !currentFavorite,
    });
  };

  const handleToggleArchive = (noteId: string, currentArchived: boolean) => {
    updateNoteMutation.mutate({
      id: noteId,
      input: { archived: !currentArchived },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent1} />
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading notes</Text>
          <Text style={styles.errorDetails}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const notes = notesData?.notes || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <FileText size={24} color={colors.text1} />
        <Text style={styles.headerTitle}>Notes</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.text2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={colors.text2}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onToggleFavorite={() => handleToggleFavorite(item.id, item.favorite)}
            onToggleArchive={() => handleToggleArchive(item.id, item.archived)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color={colors.text2} />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'No notes match your search' : 'Start by creating your first note'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text1,
      marginLeft: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      margin: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.text1,
      padding: 0,
    },
    listContent: {
      paddingBottom: 100,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    loadingText: {
      fontSize: 16,
      color: colors.text2,
      marginTop: 16,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text1,
      marginBottom: 8,
    },
    errorDetails: {
      fontSize: 14,
      color: colors.text2,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      marginTop: 60,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text1,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.text2,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
