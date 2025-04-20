import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.api}/comments`;

  constructor(private http: HttpClient) {}

  // Получение списка комментариев
  getComments(articleId: string, offset: number = 0): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?article=${articleId}&offset=${offset}`);
  }

  // Добавление нового комментария
  addComment(articleId: string, text: string): Observable<any> {
    const data = { article: articleId, text: text };
    return this.http.post<any>(`${this.apiUrl}/add`, data, { headers: this.getAuthHeaders() });
  }

  // Применение действия к комментарию (лайк, дизлайк, жалоба)
  applyAction(commentId: string, action: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${commentId}/action`, { action }, { headers: this.getAuthHeaders() });
  }

  // Получение действий пользователя для комментария
  getCommentActions(commentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${commentId}/actions`, { headers: this.getAuthHeaders() });
  }

  // Получение действий пользователя для комментариев на статью
  getArticleCommentActions(articleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/article-actions?articleId=${articleId}`, { headers: this.getAuthHeaders() });
  }

  // Получение заголовков авторизации
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
