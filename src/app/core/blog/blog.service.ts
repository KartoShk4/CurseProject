import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Article } from '../../models/article.models';
import { Category } from '../../models/category.models';
import { ArticleResponse } from "../../../type/article-response";
import {CommentType, DefaultResponseType} from "../../../type/comment.type";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:3000/api';

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
  getArticles(page: number, categories: string[]) {
    let url = `http://localhost:3000/api/articles?page=${page}`;

    if (categories.length) {
      const categoryParams = categories.map(cat => `categories=${encodeURIComponent(cat)}`).join('&');
      url += `&${categoryParams}`;
    }

    return this.http.get<ArticleResponse>(url);
  }

  getArticleByUrl(url: string): Observable<Article> {
    return this.http.get<Article>(`http://localhost:3000/api/articles/${url}`);
  }

  getRelatedArticles(articleUrl: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/related/${articleUrl}`);
  }

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
            userReaction: null
          }
        }))
      )
    );
  }


  addComment(articleId: string, text: string): Observable<DefaultResponseType> {
    const token = localStorage.getItem('accessToken');
    return this.http.post<DefaultResponseType>(`${this.baseUrl}/comments`, {
      text,
      article: articleId
    }, {
      headers: {
        'x-auth': token || ''
      }
    });
  }

}
