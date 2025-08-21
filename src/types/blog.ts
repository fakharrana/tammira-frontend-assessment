export type Author = {
  _id: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_pic_url: string;
};

export type Blog = {
  _id: string;
  title: string;
  sub_title: string;
  content: string;
  slug: string;
  tags: string[];
  author: Author;
  created_date: string;
  modified_date: string;
};

export type BlogResponse = {
  total: number;
  page: number;
  limit: number;
  blogs: Blog[];
};
