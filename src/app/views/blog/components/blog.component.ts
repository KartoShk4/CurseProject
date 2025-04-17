// import { Component, OnInit } from '@angular/core';
// import { BlogService } from 'src/app/core/blog/blog.service';
// import { Article } from 'src/app/models/article.models';
// import { Category } from 'src/app/models/category.models';
// import {Router} from "@angular/router";
//
// @Component({
//   selector: 'app-blog',
//   templateUrl: './blog.component.html',
//   styleUrls: ['./blog.component.scss']
// })
// export class BlogComponent implements OnInit {
//   articles: Article[] = [];
//   categories: Category[] = [];  // Массив объектов категорий
//   selectedCategories: string[] = [];  // Массив строк (URL категорий)
//   isFilterOpen: boolean = false;
//   pages: number[] = [];
//   activeParams = {
//     page: 1,
//     categories: [] as string[]
//   };
//
//   constructor(private blogService: BlogService,
//               private router: Router) {}
//
//   ngOnInit(): void {
//     this.loadArticles();
//     this.loadCategories();  // Загружаем категории при инициализации компонента
//   }
//
//   // Загружаем статьи с фильтрацией
//   loadArticles(): void {
//     this.blogService.getArticles(1, this.selectedCategories).subscribe(response => {
//       this.articles = response.items;
//     });
//   }
//
//   // Загружаем доступные категории
//   loadCategories(): void {
//     this.blogService.getCategories().subscribe(categories => {
//       this.categories = categories;
//     });
//   }
//
//   // Переключение выбранной категории
//   toggleCategory(categoryUrl: string): void {
//     const index = this.selectedCategories.indexOf(categoryUrl);
//     if (index > -1) {
//       this.selectedCategories.splice(index, 1);  // Удаляем категорию из выбранных
//     } else {
//       this.selectedCategories.push(categoryUrl);  // Добавляем категорию в выбранные
//     }
//     this.loadArticles();  // Перезагружаем статьи с примененным фильтром
//   }
//
//   // Проверка, выбрана ли категория
//   isCategorySelected(categoryUrl: string): boolean {
//     return this.selectedCategories.includes(categoryUrl);
//   }
//
//   // Переключение состояния фильтра
//   toggleFilterOpen(): void {
//     this.isFilterOpen = !this.isFilterOpen;
//   }
//
// // Получаем имя категории по её URL
//   getCategoryName(url: string): string {
//     const category = this.categories.find(c => c.url === url);
//     return category ? category.name : url;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/core/blog/blog.service';
import { Article } from 'src/app/models/article.models';
import { Category } from 'src/app/models/category.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleResponse } from 'src/app/models/article-response.models'; // Импорт правильного интерфейса

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];
  selectedCategories: string[] = [];
  isFilterOpen: boolean = false;
  pages: number[] = [];

  activeParams = {
    page: 1,
    categories: [] as string[]
  };

  totalPages: number = 1;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.activeParams.page = +(params.get('page') || 1);
      this.activeParams.categories = params.getAll('categories[]');
      this.selectedCategories = [...this.activeParams.categories];
      this.loadArticles();
    });

    this.loadCategories();
  }

  loadArticles(): void {
    this.blogService.getArticles(this.activeParams.page, this.activeParams.categories)
      .subscribe((response: ArticleResponse) => { // Используем правильный интерфейс
        this.articles = response.items;
        this.totalPages = response.pages;  // Используем 'pages' вместо 'totalPages'
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      });
  }

  loadCategories(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleCategory(categoryUrl: string): void {
    const index = this.selectedCategories.indexOf(categoryUrl);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryUrl);
    }

    this.router.navigate([], {
      queryParams: {
        page: 1,
        'categories[]': this.selectedCategories
      }
    });
  }

  isCategorySelected(categoryUrl: string): boolean {
    return this.selectedCategories.includes(categoryUrl);
  }

  toggleFilterOpen(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  getCategoryName(url: string): string {
    const category = this.categories.find(c => c.url === url);
    return category ? category.name : url;
  }

  openPage(page: number): void {
    if (page !== this.activeParams.page) {
      this.router.navigate([], {
        queryParams: {
          ...this.route.snapshot.queryParams,
          page
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  openPrevPage(): void {
    if (this.activeParams.page > 1) {
      this.openPage(this.activeParams.page - 1);
    }
  }

  openNextPage(): void {
    if (this.activeParams.page < this.totalPages) {
      this.openPage(this.activeParams.page + 1);
    }
  }
}
