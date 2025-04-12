import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../type/default-response.type";
import {LoginResponseType} from "../../../type/login-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // Ключи для хранения токенов и userId в localStorage
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    // Проверка токена при инициализации сервиса
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
    this.isLogged$.next(this.isLogged)
  }


  // Авторизация
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  };

  // Регистрация
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    });
  };

  // Выход из аккаунта
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      }).pipe(
        tap(() => {
          this.removeTokens();
          localStorage.removeItem('userName')
          this.isLogged$.next(false);
        })
      )
    }
    throw throwError((): string => 'Can not find token')
  }

  // Геттер статуса
  public getIsLoggedIn(): boolean {
    return this.isLogged;
  }

  // Сохраняем токены
  public setTokens(assessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, assessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  // Удаляем токены
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  // Получаем токены
  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  // В AuthService
  getUserInfo(): Observable<any> {
    const token = this.getTokens().accessToken;
    if (!token) {
      return throwError(() => new Error('No access token found'));
    }

    return this.http.get<any>(environment.api + 'users', {
      headers: {
        'x-auth': token
      }
    });
  }
}


