import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native'
import { Star, Archive } from 'lucide-react-native'
import { lightColors, darkColors } from '@arden/ui/styles/colors'
import type { Note } from '@arden/core/types'

interface NoteCardProps {
  note: Note
  onPress?: () => void
  onToggleFavorite?: () => void
  onToggleArchive?: () => void
}

export function NoteCard({ note, onPress, onToggleFavorite, onToggleArchive }: NoteCardProps) {
  const scheme = useColorScheme()
  const colors = scheme === 'dark' ? darkColors : lightColors
  const styles = getStyles(colors)

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onToggleFavorite} style={styles.actionButton}>
            <Star
              size={16}
              color={note.favorite ? colors.accent1 : colors.text2}
              fill={note.favorite ? colors.accent1 : 'transparent'}
            />
          </Pressable>
          <Pressable onPress={onToggleArchive} style={styles.actionButton}>
            <Archive
              size={16}
              color={note.archived ? colors.accent1 : colors.text2}
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={2}>
        {note.content}
      </Text>

      {note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}

      <Text style={styles.date}>
        {new Date(note.updatedAt).toLocaleDateString()}
      </Text>
    </Pressable>
  )
}

const getStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text1,
      flex: 1,
      marginRight: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    content: {
      fontSize: 14,
      color: colors.text2,
      lineHeight: 20,
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8,
    },
    tag: {
      backgroundColor: colors.muted,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    tagText: {
      fontSize: 12,
      color: colors.text2,
      fontWeight: '500',
    },
    moreTagsText: {
      fontSize: 12,
      color: colors.text2,
      alignSelf: 'center',
    },
    date: {
      fontSize: 12,
      color: colors.text2,
      textAlign: 'right',
    },
  }) 