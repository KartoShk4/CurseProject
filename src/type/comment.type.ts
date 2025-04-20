export interface CommentType {
  id: string;
  author: string;
  date: string;
  text: string;
  reactions: {
    likes: number;
    dislikes: number;
    complaints: number;
    userReaction: 'like' | 'dislike' | 'complain' | null;
  };
}

export interface DefaultResponseType {
  error?: boolean;
  message?: string;
}

export interface CommentResponseType extends DefaultResponseType {
  comment?: {
    id: string;
    author: string;
    date: string;
    text: string;
  };
}

export interface ReactionResponseType extends DefaultResponseType {
  likes?: number;
  dislikes?: number;
  complaints?: number;
}

export type UserReactionType = 'like' | 'dislike' | 'complain';
