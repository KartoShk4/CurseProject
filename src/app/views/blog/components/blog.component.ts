import {Component, HostListener, OnInit} from '@angular/core';
import { BlogService } from 'src/app/core/blog/blog.service';
import { Article } from 'src/app/models/article.models';
import { Category } from 'src/app/models/category.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleResponse } from 'src/app/models/article-response.models';
import {BlogType} from "../../../../type/blog.type";

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

  activeParams: BlogType = {
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
      .subscribe((response: ArticleResponse): void => {
        this.articles = response.items;
        this.totalPages = response.pages;
        this.pages = Array.from({ length: this.totalPages }, (_, i: number): number => i + 1);
      });
  }

  loadCategories(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleCategory(categoryUrl: string): void {
    const index: number = this.selectedCategories.indexOf(categoryUrl);
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const element = event.target as HTMLElement | null;

    if (!element?.closest('.blog-filter-sorting')) {
      this.isFilterOpen = false;
    }
  }

  getCategoryName(url: string): string {
    const category: Category | undefined = this.categories.find(c => c.url === url);
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
