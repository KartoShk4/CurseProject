import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../../models/article.models';
import { Category } from '../../models/category.models';
import {ArticleResponse} from "../../../type/article-response";

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getTopArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/articles/top`);
  }

  getArticles(page = 1): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.baseUrl}/articles?page=${page}`);
  }
}
