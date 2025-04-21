import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Article } from '../../models/article.models';
import { Category } from '../../models/category.models';
import { ArticleResponse } from "../../../type/article-response";
import { CommentType, DefaultResponseType } from "../../../type/comment.type";
import { CommentReaction } from "../../models/comment.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient,
              private authService: AuthService,) {}

  // Получаем категории
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  // Получаем топовые статьи
  getTopArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/top`);
  }

  // Получаем статьи с фильтрацией по категориям
  getArticles(page: number, categories: string[]) {
    let url: string = `http://localhost:3000/api/articles?page=${page}`;

    if (categories.length) {
      const categoryParams: string = categories.map(cat => `categories=${encodeURIComponent(cat)}`).join('&');
      url += `&${categoryParams}`;
    }

    return this.http.get<ArticleResponse>(url);
  }

  // Получаем статью по URL
  getArticleByUrl(url: string): Observable<Article> {
    return this.http.get<Article>(`http://localhost:3000/api/articles/${url}`);
  }

  // Получаем связанные статьи
  getRelatedArticles(articleUrl: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/related/${articleUrl}`);
  }

  // Получаем комментарии для статьи
  getComments(articleId: string, offset: number = 0): Observable<CommentType[]> {
    return this.http.get<{ comments: any[] }>(`${this.baseUrl}/comments`, {
      params: {
        article: articleId,
        offset: offset.toString()
      }
    }).pipe(
      map(response =>
        response.comments.map(comment => ({
          id: comment.id,
          author: comment.user?.name || 'Аноним',
          date: comment.date,
          text: comment.text,
          reactions: {
            likes: comment.likesCount || 0,
            dislikes: comment.dislikesCount || 0,
            complaints: 0,
          },
          userReaction: null
        }))
      )
    );
  }

  // Добавляем комментарий
  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    const token: string | null = localStorage.getItem('accessToken');
    return this.http.post<DefaultResponseType>(`${this.baseUrl}/comments`, {
      text,
      article: articleId
    }, {
      headers: {
        'x-auth': token || ''
      }
    });
  }

  // Получаем токен пользователя
  public getToken(): string | null {
    return this.authService.getTokens().accessToken;
  }

  // Получаем реакции пользователя на комментарии
  getUserReactions(articleId: string): Observable<CommentReaction[]> {
    const token: string | null = this.authService.getTokens().accessToken;

    return this.http.get<CommentReaction[]>(
      `${this.baseUrl}/comments/article-comment-actions?articleId=${articleId}`,
      {
        headers: {
          'x-auth': token || ''
        }
      }
    );
  }

  // Добавляем реакцию (лайк, дизлайк, жалоба) на комментарий
  addReaction(commentId: string, action: 'like' | 'dislike' | 'violate') {
    const token: string | null = this.authService.getTokens().accessToken;

    return this.http.post<{ message: string }>(
      `${this.baseUrl}/comments/${commentId}/apply-action`,
      { action },
      {
        headers: {
          'x-auth': token || ''
        }
      }
    );
  }
}
