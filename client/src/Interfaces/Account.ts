import { Animal, Herd, Post } from "@prisma/client";

export interface User {
  id?: string;
  username?: string;
  password?: string;
  email: string;
  avatar?: string;
  token?: string;
  herdle?: Animal[];
  followedByIDs?: string[];
  followingIDs?: string[];
  posts?: Post[];
  herds?: Herd[];
}
