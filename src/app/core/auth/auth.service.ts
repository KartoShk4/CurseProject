import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, throwError } from "rxjs";
import { DefaultResponseType } from "../../../type/default-response.type";
import { LoginResponseType } from "../../../type/login-response.type";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ключи для хранения токенов и userId в localStorage (для того, чтобы сохранять данные на клиенте)
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  // Состояние логина пользователя
  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Локальная переменная для отслеживания статуса логина
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    // Проверка токена при инициализации сервиса (если есть токен, пользователь считается залогиненым)
    // Проверяем, есть ли accessToken в localStorage
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
    this.isLogged$.next(this.isLogged);
  }

  // Авторизация пользователя (отправляем запрос на сервер с email и паролем)
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe  // Отправляем данные на сервер
    });
  };

  // Регистрация нового пользователя (отправляем имя, email и пароль)
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password  // Отправляем данные на сервер
    });
  };

  // Выход из аккаунта (удаляем токены и выполняем запрос logout на сервере)
  logout(): Observable<DefaultResponseType> {
    // Получаем токены из localStorage
    const tokens = this.getTokens();
    // Проверяем, есть ли refreshToken
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        // Отправляем refreshToken для выхода
        refreshToken: tokens.refreshToken
      }).pipe(
        tap((): void => {
          this.removeTokens();
          localStorage.removeItem('userName');
          this.isLogged$.next(false);
        })
      );
    }
    // Если нет refreshToken, выбрасываем ошибку
    throw throwError((): string => 'Can not find token');
  }

  // Сохраняем токены в localStorage
  public setTokens(assessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, assessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  // Удаляем токены из localStorage
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  // Получаем токены из localStorage
  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  // Получаем userId из localStorage
  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  // Устанавливаем userId в localStorage
  set userId(id: string | null) {
    if (id) {  // Если id не null, сохраняем его
      localStorage.setItem(this.userIdKey, id);
    } else {  // Если id null, удаляем из localStorage
      localStorage.removeItem(this.userIdKey);
    }
  }

  // Получаем информацию о пользователе с сервера (используем токен для авторизации)
  getUserInfo(): Observable<any> {
    const token: string | null = this.getTokens().accessToken;
    if (!token) {  // Если токен не найден
      return throwError((): Error => new Error('No access token found'));
    }

    return this.http.get<any>(environment.api + 'users', {
      headers: {
        'x-auth': token
      }
    });
  }
}
