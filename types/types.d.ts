type TBlogPost = {
  id?: string;
  slug: string;
  title: string;
  desc: string;
  author: string;
  content: string;
  tags: string[];
  date: string;
  published: boolean;
  mainImageUrl?: string;
  createdAt?: any;
};

type TBlogPostForm = {
  slug: string;
  title: string;
  desc: string;
  author: string;
  tags: string[];
  date: string;
  published: boolean;
  mainImageUrl?: string;
};
