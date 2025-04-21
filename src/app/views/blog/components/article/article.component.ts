import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../core/blog/blog.service';
import { Article } from '../../../../models/article.models';
import { AuthService } from "../../../../core/auth/auth.service";
import { Observable } from "rxjs";
import { CommentType } from "../../../../../type/comment.type";
import { CommentReaction } from "../../../../models/comment.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];
  comments: CommentType[] = [];
  allComments: CommentType[] = [];
  userReactions: CommentReaction[] = [];

  isLogged$: Observable<boolean>;
  newCommentText: string = '';
  articleId!: string;
  articleUrl!: string;
  offset: number = 0;
  isLoadingComments: boolean = false;
  hasMoreComments: boolean = true;
  commentsPerPage: number = 10;
  initialLoadCount: number = 3;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    this.isLogged$ = this.authService.isLogged$;
  }

  ngOnInit(): void {
    const url = this.route.snapshot.paramMap.get('url');
    if (url) {
      this.blogService.getArticleByUrl(url).subscribe((article) => {
        this.article = article;
        this.articleId = article.id;

        // Загружаем все комментарии
        this.blogService.getComments(this.articleId, 0).subscribe(comments => {
          this.allComments = comments;
          this.comments = this.allComments.slice(0, this.initialLoadCount);
          this.offset = this.initialLoadCount;

          if (this.offset >= this.allComments.length) {
            this.hasMoreComments = false;
          }

          // Загружаем реакции пользователя для комментариев
          this.blogService.getUserReactions(this.articleId).subscribe(reactions => {
            this.userReactions = reactions;

            // Обновляем комментарии с учетом реакций пользователя
            this.comments = this.comments.map(comment => {
              const userReaction = this.userReactions.find(r => r.comment === comment.id);
              if (userReaction) {
                comment.userReaction = userReaction.action;
              }
              return comment;
            });
          });
        });

        // Загружаем связанные статьи
        this.blogService.getRelatedArticles(this.article.url).subscribe((related) => {
          this.relatedArticles = related;
        });
      });
    }
  }


  loadComments(): void {
    const next = this.allComments.slice(this.offset, this.offset + this.commentsPerPage);
    this.comments = [...this.comments, ...next];
    this.offset += next.length;

    if (this.offset >= this.allComments.length) {
      this.hasMoreComments = false;
    }
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    if (!this.articleId) {
      console.warn('Article ID is not set yet');
      return;
    }

    this.blogService.addComment(this.articleId, this.newCommentText).subscribe(response => {
      if (!response.error) {
        this.newCommentText = '';
        this.offset = 0;
        this.comments = [];

        // Загружаем все комментарии заново
        this.blogService.getComments(this.articleId, 0).subscribe(comments => {
          this.allComments = comments;
          this.comments = this.allComments.slice(0, this.initialLoadCount);
          this.offset = this.initialLoadCount;

          if (this.offset >= this.allComments.length) {
            this.hasMoreComments = false;
          }
        });
      }
    });
  }

  onReact(commentId: string, action: 'like' | 'dislike' | 'violate') {
    const token = this.authService.getTokens().accessToken;
    if (!token) {
      this._snackBar.open('Вы должны быть авторизованы', '', { duration: 3000 });
      return;
    }

    this.blogService.addReaction(commentId, action).subscribe({
      next: () => {
        const message = action === 'violate' ? 'Жалоба отправлена' : 'Ваш голос учтен';
        this._snackBar.open(message, '', { duration: 3000 });

        // Обновляем комментарий с новой реакцией
        this.comments = this.comments.map(comment => {
          if (comment.id !== commentId) return comment;

          const current = comment.userReaction;
          let updatedReaction: 'like' | 'dislike' | 'violate' | null = current === action ? null : action;

          let likes = comment.reactions.likes;
          let dislikes = comment.reactions.dislikes;

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

        // Синхронизируем состояние реакции с сервером (это необязательно, если сервер уже обновляет данные)
        this.blogService.getUserReactions(this.articleId).subscribe(reactions => {
          this.userReactions = reactions;
        });
      },
      error: (err) => {
        const msgFromBackend = err.error?.message;
        const message = msgFromBackend === 'Это действие уже применено к комментарию'
          ? 'Жалоба уже отправлена'
          : 'Произошла ошибка';
        this._snackBar.open(message, '', { duration: 3000 });
      }
    });
  }


}
