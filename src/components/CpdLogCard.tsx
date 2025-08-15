import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_COLORS } from '../constants';
import { CpdLog } from '../types';

/**
 * Props for the CpdLogCard component
 * 
 * @interface CpdLogCardProps
 * @property {CpdLog} log - The CPD log data to display
 * @property {() => void} [onPress] - Optional callback when card is pressed
 * @property {(id: string) => void} [onDelete] - Optional callback to delete the log
 * @property {boolean} [showActions=false] - Whether to show action buttons like delete
 * @property {any} [style] - Additional styles to apply to the card container
 */
interface CpdLogCardProps {
  log: CpdLog;
  onPress?: () => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  style?: any;
}

/**
 * A card component for displaying CPD log entries
 * Includes formatting for dates, tags, and optional actions
 * 
 * @component
 * @param {CpdLogCardProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const CpdLogCard = memo<CpdLogCardProps>(({ 
  log, 
  onPress, 
  onDelete, 
  showActions = false,
  style 
}) => {
  /**
   * Handles the delete action
   * Calls the onDelete callback with the log ID
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(log.id);
    }
  };

  /**
   * Formats a timestamp into a human-readable date string
   * 
   * @param {number} timestamp - Milliseconds since epoch
   * @returns {string} Formatted date string (e.g., "15 Jan 2023")
   */
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardCategory}>{log.category}</Text>
          <Text style={styles.cardHours}>{log.hours}h</Text>
        </View>
        <View style={styles.cardRight}>
          {log.isVoiceGenerated && (
            <Ionicons name="mic" size={16} color={APP_COLORS.info} />
          )}
          {showActions && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color={APP_COLORS.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={styles.cardText} numberOfLines={3}>
        {log.text}
      </Text>
      
      {log.tags && log.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {log.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {log.tags.length > 3 && (
            <Text style={styles.moreTags}>+{log.tags.length - 3}</Text>
          )}
        </View>
      )}
      
      <Text style={styles.cardMeta}>
        {formatDate(log.createdAt)}
        {log.isVoiceGenerated && ' • Voice Input'}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: APP_COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardCategory: {
    color: APP_COLORS.info,
    fontSize: 12,
    fontWeight: '600',
  },
  cardHours: {
    color: APP_COLORS.success,
    fontSize: 12,
    fontWeight: '600',
  },
  cardText: {
    color: APP_COLORS.text,
    fontSize: 14,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: APP_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  moreTags: {
    color: APP_COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
    alignSelf: 'center',
  },
  cardMeta: {
    color: APP_COLORS.textMuted,
    fontSize: 11,
  },
  deleteButton: {
    padding: 4,
  },
});

CpdLogCard.displayName = 'CpdLogCard';

export default CpdLogCard;
