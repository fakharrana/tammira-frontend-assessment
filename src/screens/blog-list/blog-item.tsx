import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Blog } from '../../types/blog';

const BlogItem = ({ blog }: { blog: Blog }) => (
  <View style={styles.blogItem}>
    <Text style={styles.title}>{blog.title}</Text>
    <Text style={styles.subtitle}>{blog.sub_title}</Text>
    <Text style={styles.author}>
      By {blog.author.first_name} {blog.author.last_name}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  blogItem: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
    opacity: 0.7,
    lineHeight: 20,
  },
  author: {
    fontStyle: 'italic',
    color: '#000000',
    opacity: 0.6,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default BlogItem;
