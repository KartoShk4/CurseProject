import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../models/article.models';
import { Category } from '../../models/category.models';
import { ArticleResponse } from "../../../type/article-response";

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


}
