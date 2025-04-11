import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
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

public isLogged$: Subject<boolean> = new Subject<boolean>();
private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    // Проверка токена при инициализации сервиса
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
  }

  // Авторизация
  login(email:string, password:string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
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

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
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
}


