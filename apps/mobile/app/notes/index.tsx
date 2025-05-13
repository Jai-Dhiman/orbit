import * as React from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { Text } from '../../src/components/ui/text';
import { Card, CardContent } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { router } from 'expo-router';
import { useNotes } from '../../src/features/notes/hooks';
import type { Note } from '../../src/features/notes/types';

export default function NotesScreen() {
  const { notes, setSelectedNote } = useNotes();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddNote = () => {
    router.push('/notes/new');
  };

  const handleNotePress = (noteId: string) => {
    setSelectedNote(noteId);
    router.push(`/notes/${noteId}`);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <Pressable className="mb-3" onPress={() => handleNotePress(item.id)}>
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-sans-medium mb-1">{item.title}</Text>
          <Text className="font-sans text-neutral-600 dark:text-neutral-400" numberOfLines={2}>
            {item.content}
          </Text>
          <Text className="text-xs mt-2 font-sans text-neutral-500">
            Updated {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-sans-bold text-foreground">Notes</Text>
          <Button
            size="icon"
            className="bg-primary-solid h-10 w-10 rounded-full"
            onPress={handleAddNote}
          >
            <Plus size={20} color="white" />
          </Button>
        </View>

        {notes.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-neutral-500 font-sans-medium mb-4">No notes yet</Text>
            <Button onPress={handleAddNote} className="bg-primary-solid">
              Create your first note
            </Button>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
} 