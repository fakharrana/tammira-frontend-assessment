import React, { useState, useEffect, useMemo, startTransition } from 'react';
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useGetBlogsQuery, useGetAllTagsQuery } from '../../store/blog';
import { Blog } from '../../types/blog';
import BlogItem from './blog-item';

const BlogList = () => {
  const [page, setPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Convert selectedTags array to comma-separated string for API
  const tagsQuery =
    selectedTags.length > 0 ? selectedTags.join(',') : undefined;

  const { data: tags = [], isLoading: isLoadingTags } = useGetAllTagsQuery();
  const {
    data,
    error,
    isLoading: isLoadingBlogs,
    isFetching,
  } = useGetBlogsQuery(
    {
      page,
      limit: 10,
      tags: tagsQuery,
    },
    { refetchOnMountOrArgChange: true },
  );

  const blogs = data?.blogs || [];
  const total = data?.total || 0;

  useEffect(() => {
    if (!tags.length) return;

    setAvailableTags(tags);
  }, [tags]);

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;

    const query = searchQuery.toLowerCase().trim();

    return blogs.filter(
      blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.sub_title?.toLowerCase().includes(query) ||
        blog.author.first_name.toLowerCase().includes(query) ||
        blog.author.last_name.toLowerCase().includes(query),
    );
  }, [blogs, searchQuery]);

  const loadMore = () => {
    if (!isFetching && blogs.length < total) {
      setPage(prev => prev + 1);
    }
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery('');
    setPage(1);
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearAllTags = () => {
    startTransition(() => {
      setSearchQuery('');
      setPage(1);
      setSelectedTags([]);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderBlogItem = ({ item }: { item: Blog }) => <BlogItem blog={item} />;

  if ((isLoadingBlogs || isLoadingTags) && page === 1) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>Error loading blogs</Text>
      </View>
    );
  }

  const renderClearButton = () =>
    selectedTags.length > 0 ? (
      <TouchableOpacity onPress={clearAllTags} style={styles.clearAllButton}>
        <Text style={styles.clearAllButtonText}>Clear</Text>
      </TouchableOpacity>
    ) : null;

  const renderSelectedTags = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tagsScrollContainer}
    >
      {availableTags.map(tag => (
        <TouchableOpacity
          key={tag}
          onPress={() => handleTagPress(tag)}
          style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
        >
          <Text
            style={[
              styles.tagText,
              selectedTags.includes(tag) && styles.tagTextSelected,
            ]}
          >
            #{tag}
          </Text>
          {selectedTags.includes(tag) && (
            <Text style={styles.selectedIndicator}> ✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search blogs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />
      {searchQuery.length ? (
        <TouchableOpacity
          onPress={clearSearch}
          style={styles.clearSearchButton}
        >
          <Text style={styles.clearSearchText}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderBlogs = () => (
    <FlatList
      data={filteredBlogs}
      keyExtractor={item => item._id}
      renderItem={renderBlogItem}
      onEndReached={searchQuery ? undefined : loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.empty}>
            {searchQuery ? 'No matching blogs found' : 'No blogs found'}
          </Text>
          {searchQuery ? (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.tryAgainButton}
            >
              <Text style={styles.tryAgainText}>Clear search</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      }
      ListFooterComponent={
        isFetching && !searchQuery ? (
          <ActivityIndicator style={styles.footerLoader} color="#4CAF50" />
        ) : null
      }
      contentContainerStyle={styles.blogListContent}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        <View style={styles.tagsHeader}>
          <Text style={styles.tagsTitle}>Filter by Tags:</Text>
          {renderClearButton()}
        </View>
        {renderSelectedTags()}
      </View>
      {renderSearchBar()}
      {renderBlogs()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tagsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  tagsScrollContainer: {
    paddingRight: 16,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  selectedIndicator: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  clearAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearAllButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearSearchText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  blogListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  error: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  empty: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  tryAgainButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  tryAgainText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  footerLoader: {
    marginVertical: 20,
  },
});

export default BlogList;
