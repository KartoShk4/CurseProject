import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../core/blog/blog.service';
import { Article } from '../../../../models/article.models';
import { AuthService } from "../../../../core/auth/auth.service";
import { Observable} from "rxjs";
import { CommentType } from "../../../../../type/comment.type";
import { CommentReaction } from "../../../../models/comment.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import {ReactionType} from "../../../../../type/reaction.type";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];
  comments: CommentType[] = [];
  userReactions: CommentReaction[] = [];

  isLogged$: Observable<boolean>;
  newCommentText: string = '';
  articleId: string;
  offset: number = 0;
  isLoadingComments: boolean = false;
  hasMoreComments: boolean = true;
  commentsPerPage: number = 10;
  initialLoadCount: number = 3;
  ReactionType: typeof ReactionType = ReactionType;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    this.isLogged$ = this.authService.isLogged$;
    this.articleId = '';
  }

  ngOnInit(): void {
    const url: string | null = this.route.snapshot.paramMap.get('url');
    if (url) {
      // Загрузка самой статьи
      this.blogService.getArticleByUrl(url).subscribe(article => {
        this.article = article;
        this.articleId = article.id;

        // Загрузка связанных статей
        this.loadRelatedArticles(url);  // Передаем articleUrl, чтобы получить связанные статьи
        this.loadComments(this.initialLoadCount);
      });
    }
  }

  loadRelatedArticles(articleUrl: string): void {
    this.blogService.getRelatedArticles(articleUrl).subscribe(articles => {
      this.relatedArticles = articles;
    });
  }

  loadComments(count: number = this.commentsPerPage): void {
    this.isLoadingComments = true;

    this.blogService.getComments(this.articleId, this.offset, count).subscribe(comments => {
      const sliced: CommentType[] = comments.slice(0, count);
      this.comments = [...this.comments, ...sliced];
      this.offset += sliced.length;
      this.hasMoreComments = sliced.length === count;
      this.isLoadingComments = false;
    });
  }

  onLoadMore(): void {
    this.loadComments(this.commentsPerPage); // Загружаем по 10
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    if (!this.articleId) return;

    this.blogService.addComment(this.articleId, this.newCommentText).subscribe(response => {
      if (!response.error) {
        this.newCommentText = '';
        this.offset = 0;
        this.comments = [];

        this.loadComments(this.initialLoadCount); // Загружаем первые 3 комментария снова
      }
    });
  }

  onReact(commentId: string, action: ReactionType): void {
    const token: string | null = this.authService.getTokens().accessToken;
    if (!token) {
      this._snackBar.open('Вы должны быть авторизованы', '', { duration: 3000 });
      return;
    }

    this.blogService.addReaction(commentId, action).subscribe({
      next: (): void => {
        const message = action === 'violate' ? 'Жалоба отправлена' : 'Ваш голос учтен';
        this._snackBar.open(message, '', { duration: 3000 });

        // Обновляем комментарий с новой реакцией
        this.comments = this.comments.map(comment => {
          if (comment.id !== commentId) return comment;

          const current = comment.userReaction;
          let updatedReaction: ReactionType | null = current === action ? null : action;

          let likes: number = comment.reactions.likes;
          let dislikes: number = comment.reactions.dislikes;

          if (action === 'like') {
            likes += current === 'like' ? -1 : 1;
            if (current === 'dislike') dislikes--;
          }

          if (action === 'dislike') {
            dislikes += current === 'dislike' ? -1 : 1;
            if (current === 'like') likes--;
          }

          return {
            ...comment,
            reactions: {
              ...comment.reactions,
              likes,
              dislikes,
              complaints: comment.reactions.complaints
            },
            userReaction: updatedReaction
          };
        });

        this.blogService.getUserReactions(this.articleId).subscribe(reactions => {
          this.userReactions = reactions;
        });
      },
      error: (err): void => {
        const msgFromBackend = err.error?.message;
        const message = msgFromBackend === 'Это действие уже применено к комментарию'
          ? 'Жалоба уже отправлена'
          : 'Произошла ошибка';
        this._snackBar.open(message, '', { duration: 3000 });
      }
    });
  }


}
