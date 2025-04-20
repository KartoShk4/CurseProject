import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../../models/article.models';
import { Category } from '../../../models/category.models';
import { ArticleResponse } from "../../../../type/article-response";
import {CommentType, CommentResponseType, DefaultResponseType, ReactionResponseType} from "../../../../type/comment.type";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {}

  // Получаем категории
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  // Получаем топовые статьи
  getTopArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/top`);
  }

  // Получаем статьи с фильтрацией по категориям
  getArticles(page: number, categories: string[]): Observable<ArticleResponse> {
    let params = new HttpParams().set('page', page.toString());

    if (categories.length) {
      categories.forEach(cat => {
        params = params.append('categories', cat);
      });
    }

    return this.http.get<ArticleResponse>(`${this.baseUrl}/articles`, { params });
  }

  getArticleByUrl(url: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/articles/${url}`);
  }

  getRelatedArticles(articleUrl: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/related/${articleUrl}`);
  }

  // Комментарии
  getComments(articleId: string, offset: number = 0): Observable<{ allCount: number, comments: CommentType[] }> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('article', articleId);

    return this.http.get<{ allCount: number, comments: CommentType[] }>(`${this.baseUrl}/comments`, { params });
  }

  addComment(articleId: string, text: string): Observable<CommentResponseType> {
    return this.http.post<CommentResponseType>(`${this.baseUrl}/comments`, {
      article: articleId,
      text: text
    });
  }

  sendReaction(commentId: string, reaction: 'like' | 'dislike' | 'complain'): Observable<ReactionResponseType> {
    return this.http.post<ReactionResponseType>(`${this.baseUrl}/comments/${commentId}/reaction`, {
      reaction
    });
  }

  getCommentActions(articleId: string): Observable<{ [commentId: string]: string }> {
    return this.http.get<{ [commentId: string]: string }>(`${this.baseUrl}/comments/actions`, {
      params: new HttpParams().set('articleId', articleId)
    });
  }
}
