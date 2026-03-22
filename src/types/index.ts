export interface User {
  id: string | number;
  name: string;
  email: string;
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  image?: string;
  authorId: string | number;
  authorName?: string;
  createdAt: string;
  likesCount: number;
}
