export interface CommentReaction {
  comment: string;
  action: 'like' | 'dislike' | 'violate';
}
