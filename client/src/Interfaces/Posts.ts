import { Post as PostPrisma } from "@prisma/client";
import { User } from "./Account";

export interface Comment {
  id: String;
  user: User;
  userId: string;
  body: string;
  created: string;
  post: Post;
  postId: string;
  upVotesUsers: User[];
  upVotesIDs: string[];
  DownVotesUsers: User[];
  DownVotesIDs: string[];
}

export interface Post extends PostPrisma {
  comments?: Comment[];
}
