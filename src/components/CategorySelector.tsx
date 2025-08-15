import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { CpdCategory } from '../types';
import { CPD_CATEGORIES, APP_COLORS } from '../constants';

/**
 * Props for the CategorySelector component
 * 
 * @interface CategorySelectorProps
 * @property {CpdCategory} selectedCategory - Currently selected category
 * @property {(category: CpdCategory) => void} onSelectCategory - Callback when a category is selected
 * @property {any} [style] - Additional styles to apply to the container
 */
interface CategorySelectorProps {
  selectedCategory: CpdCategory;
  onSelectCategory: (category: CpdCategory) => void;
  style?: any;
}

/**
 * A horizontal scrollable list of category options
 * Allows selection of a CPD category with visual feedback
 * 
 * @component
 * @param {CategorySelectorProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const CategorySelector = memo<CategorySelectorProps>(({ 
  selectedCategory, 
  onSelectCategory, 
  style 
}) => {
  /**
   * Renders an individual category chip
   * Applies selected styling when appropriate
   * 
   * @param {Object} params - Render item params from FlatList
   * @param {CpdCategory} params.item - Category to render
   * @returns {React.ReactElement} Rendered category chip
   */
  const renderCategory = ({ item }: { item: CpdCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.categoryChipSelected
      ]}
      onPress={() => onSelectCategory(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryChipText,
        selectedCategory === item && styles.categoryChipTextSelected
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Category:</Text>
      <FlatList
        horizontal
        data={CPD_CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={renderCategory}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        removeClippedSubviews={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: APP_COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryList: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    backgroundColor: APP_COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: APP_COLORS.white,
    borderColor: APP_COLORS.primary,
  },
  categoryChipText: {
    color: APP_COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: APP_COLORS.primary,
  },
});

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
