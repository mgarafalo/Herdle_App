import { Animal, Post } from "@prisma/client";

export interface User {
  id?: string;
  username?: string;
  password?: string;
  email: string;
  avatar?: string;
  token?: string;
  herdle: Animal[];
  followers?: string[];
  following?: string[];
  posts?: Post[];
}
