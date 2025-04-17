import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/core/blog/blog.service';
import { Article } from 'src/app/models/article.models';
import { Category } from 'src/app/models/category.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];  // Массив объектов категорий
  selectedCategories: string[] = [];  // Массив строк (URL категорий)
  isFilterOpen: boolean = false;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadArticles();
    this.loadCategories();  // Загружаем категории при инициализации компонента
  }

  // Загружаем статьи с фильтрацией
  loadArticles(): void {
    this.blogService.getArticles(1, this.selectedCategories).subscribe(response => {
      this.articles = response.items;
    });
  }

  // Загружаем доступные категории
  loadCategories(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Переключение выбранной категории
  toggleCategory(categoryUrl: string): void {
    const index = this.selectedCategories.indexOf(categoryUrl);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);  // Удаляем категорию из выбранных
    } else {
      this.selectedCategories.push(categoryUrl);  // Добавляем категорию в выбранные
    }
    this.loadArticles();  // Перезагружаем статьи с примененным фильтром
  }

  // Проверка, выбрана ли категория
  isCategorySelected(categoryUrl: string): boolean {
    return this.selectedCategories.includes(categoryUrl);
  }

  // Переключение состояния фильтра
  toggleFilterOpen(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

// Получаем имя категории по её URL
  getCategoryName(url: string): string {
    const category = this.categories.find(c => c.url === url);
    return category ? category.name : url;
  }
}
