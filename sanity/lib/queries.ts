import { groq } from "next-sanity";

export type SanityAuthor = {
  name: string;
  role?: string;
  bio?: string;
  image?: unknown;
};

export type SanityCategory = {
  title: string;
  slug: string;
};

export type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  metaTitle?: string;
  canonical?: string;
  publishedAt: string;
  updatedAt?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  readTime?: string;
  tldr?: string;
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  body?: unknown[];
  author?: SanityAuthor;
  categories?: SanityCategory[];
};

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  metaTitle,
  canonical,
  publishedAt,
  updatedAt,
  primaryKeyword,
  secondaryKeywords,
  readTime,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  author->{
    name,
    role,
    image
  },
  categories[]->{
    title,
    "slug": slug.current
  }
}`;

export const POST_QUERY = groq`*[_type == "post" && (
  slug.current == $slug ||
  slug.current in [$slug, "/" + $slug, "/blog/" + $slug, "blog/" + $slug, $slug + "/", "/blog/" + $slug + "/"]
)][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  metaTitle,
  canonical,
  publishedAt,
  updatedAt,
  primaryKeyword,
  secondaryKeywords,
  readTime,
  tldr,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  },
  body,
  author->{
    name,
    role,
    bio,
    image
  },
  categories[]->{
    title,
    "slug": slug.current
  }
}`;

export const POST_SLUGS_QUERY = groq`*[_type == "post" && defined(slug.current)][].slug.current`;
