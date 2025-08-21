import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BlogResponse } from '../types/blog';
import envConfig from '../config/environment';

const mergeBlogs = (currentCache: BlogResponse, newData: BlogResponse) => {
  if (newData.page && newData.page > 1) {
    const existingIds = new Set(currentCache.blogs.map(b => b._id));
    const newBlogs = newData.blogs.filter(b => !existingIds.has(b._id));
    currentCache.blogs.push(...newBlogs);
  } else {
    currentCache.blogs = newData.blogs;
  }

  currentCache.page = newData.page;
  currentCache.total = newData.total;
};

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.apiBaseUrl }),
  endpoints: builder => ({
    getBlogs: builder.query<
      BlogResponse,
      { page?: number; limit?: number; tags?: string }
    >({
      query: ({ page = 1, limit = 10, tags }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (tags) params.append('tags', tags);
        return `blogs?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.tags || 'all'}`,
      merge: mergeBlogs,
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.tags !== previousArg?.tags
        );
      },
    }),
    getAllTags: builder.query<string[], void>({
      query: () => 'blogs/tags',
    }),
  }),
});

export const { useGetBlogsQuery, useGetAllTagsQuery } = blogApi;
