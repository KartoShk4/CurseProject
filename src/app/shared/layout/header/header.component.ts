import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Имя пользователя, отображается в хедере
  userName: string = '';

  // Статус авторизации (используется для отображения нужного блока)
  isLogged: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Подписка на поток isLogged$ из AuthService
    // Срабатывает при изменении статуса авторизации
    this.authService.isLogged$.subscribe((isLoggedIn: boolean): void => {
      this.isLogged = isLoggedIn;

      if (isLoggedIn) {
        // Если пользователь авторизован, получаем его имя с сервера
        this.authService.getUserInfo().subscribe({
          next: (userData: { name: string }) => {
            this.userName = userData.name;
            // Сохраняем имя пользователя в localStorage
            localStorage.setItem('userName', userData.name);
          },
          error: (err) => {
            // Если не удалось получить имя — выводим ошибку
            console.error('Ошибка при получении информации о пользователе:', err);
          }
        });
      } else {
        // Если пользователь вышел — очищаем имя
        this.userName = '';
        localStorage.removeItem('userName');
      }
    });

    // Если имя пользователя уже сохранено в localStorage — показываем его сразу
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      this.userName = storedUserName;
    }
  }

  // Выход из аккаунта
  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.doLogout(),
      error: () => this.doLogout() // даже если не получилось сделать logout на сервере — всё равно очищаем локальные данные
    });
  }

  // Очистка данных и переход на главную
  private doLogout(): void {
    this.authService.removeTokens();         // удаляем токены
    this.authService.userId = null;          // сбрасываем userId
    this._snackBar.open('Вы вышли из аккаунта', 'Закрыть', { duration: 3000 }); // уведомление
    this.router.navigate(['/']);             // переходим на главную страницу
  }
}
