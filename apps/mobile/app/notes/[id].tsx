import * as React from 'react';
import { View, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import { Text } from '../../src/components/ui/text';
import { Button } from '../../src/components/ui/button';
import { useLocalSearchParams, router } from 'expo-router';
import { useNotes } from '../../src/features/notes/hooks';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNewNote = id === 'new';

  const [isLoading, setIsLoading] = React.useState(false);
  const { getNote, createNote, updateNote, deleteNote } = useNotes();

  const note = !isNewNote ? getNote(id) : undefined;

  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');

  const handleSave = async () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    setIsLoading(true);

    try {
      if (isNewNote) {
        await createNote({ title, content });
      } else if (note) {
        await updateNote({ id, title, content });
      }

      router.back();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteNote(id);
              router.back();
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note. Please try again.');
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center p-4 border-b border-neutral-200 dark:border-neutral-800">
        <Button
          size="icon"
          variant="ghost"
          onPress={handleBack}
          className="mr-2"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Button>
        <Text className="text-lg font-sans-medium flex-1 text-foreground">
          {isNewNote ? 'New Note' : 'Edit Note'}
        </Text>
        {!isNewNote && (
          <Button
            size="icon"
            variant="ghost"
            onPress={handleDelete}
            className="mr-2"
          >
            <Trash2 size={20} className="text-destructive" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onPress={handleSave}
        >
          <Save size={24} className="text-foreground" />
        </Button>
      </View>

      <ScrollView className="flex-1 p-4">
        <TextInput
          className="text-xl font-sans-medium mb-4 text-foreground"
          placeholder="Title"
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          className="text-base font-sans flex-1 text-foreground"
          placeholder="Start typing..."
          placeholderTextColor="#9ca3af"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
          style={{ minHeight: 300 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
} 