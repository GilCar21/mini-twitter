import { api } from './api';

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  createdAt: string;
  likesCount: number;
  hasLiked: boolean;
  authorName: string;
}

export interface GetPostsParams {
  page?: string | number;
  search?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image?: string;
}

export const getPosts = async (params?: GetPostsParams) => {
  const response = await api.get('/posts/', { params });
  console.log(response.data)
  return response.data;
};

export const createPost = async (data: CreatePostPayload) => {
  const response = await api.post('/posts/', data);
  return response.data;
};

export const updatePost = async (id: string, data: CreatePostPayload) => {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const likePost = async (id: string) => {
  const response = await api.post(`/posts/${id}/like`);
  console.log(response.data)
  return response.data;
};
