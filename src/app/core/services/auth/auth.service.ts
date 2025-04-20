import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DefaultResponseType } from '../../../../type/default-response.type';
import { LoginResponseType } from '../../../../type/login-response.type';
import { environment } from '../../../../environments/environment';
import { UserType } from "../../../../type/user.type";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Ключи для хранения данных в localStorage
  private readonly accessTokenKey: string = 'accessToken';
  private readonly refreshTokenKey: string = 'refreshToken';
  private readonly userIdKey: string = 'userId';
  private readonly userKey: string = 'user';

  // Subjects для управления состоянием
  private isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<UserType | null> = new BehaviorSubject<UserType | null>(null);

  // Public observables
  public isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Инициализация состояния из localStorage
    this.isLoggedSubject.next(!!localStorage.getItem(this.accessTokenKey));

    const userJson = localStorage.getItem(this.userKey);
    if (userJson) {
      try {
        this.currentUserSubject.next(JSON.parse(userJson));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem(this.userKey);
      }
    }
  }

  // Геттер для текущего пользователя
  get currentUserValue(): UserType | null {
    return this.currentUserSubject.value;
  }

  // Геттер для userId
  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Геттер для токена
  get token(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Проверка возможности комментирования
  get canComment(): boolean {
    return this.isLoggedSubject.value;
  }

  // Авторизация
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(
      environment.api + 'login',
      { email, password, rememberMe }
    ).pipe(
      tap((response: any) => {
        if (response && response.accessToken && response.refreshToken) {
          this.setTokens(response.accessToken, response.refreshToken);
          if (response.user) {
            this.setUserInfo(response.user);
          }
          if (response.userId) {
            localStorage.setItem(this.userIdKey, response.userId);
          }
        }
      })
    );
  }

  // Регистрация
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(
      environment.api + 'signup',
      { name, email, password }
    );
  }

  // Выход из системы
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    return this.http.post<DefaultResponseType>(
      environment.api + 'logout',
      { refreshToken: tokens.refreshToken }
    ).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  // Получение информации о пользователе
  getUserInfo(): Observable<UserType> {
    const token = this.token;
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    return this.http.get<UserType>(environment.api + 'users', {
      headers: { 'x-auth': token }
    }).pipe(
      tap(user => {
        this.setUserInfo(user);
      })
    );
  }

  // Получение токенов
  public getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  // Установка токенов
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedSubject.next(true);
  }

  // Установка информации о пользователе
  private setUserInfo(user: UserType): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Очистка данных аутентификации
  private clearAuthData(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  // Добавьте этот метод для удаления токенов
  public clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedSubject.next(false);
  }

  private _userId: string | null = null;

  set userId(id: string | null) {
    this._userId = id;
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get isLoggedValue(): boolean {
    return this.isLoggedSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

}
