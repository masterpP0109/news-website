export interface Blog {
  _id: string;
  title: string;
  category: string;
  author: string;
  publishedAt?: string;
  createdAt: string;
  excerpt?: string;
  imageUrl?: string;
  published?: boolean;
}

export interface BlogResponse {
  blogs: Blog[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status?: number;
}