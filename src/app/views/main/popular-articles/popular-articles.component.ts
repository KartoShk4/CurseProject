import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../core/blog/blog.service';
import { Article } from '../../../models/article.models';
import { Category } from '../../../models/category.models';

@Component({
  selector: 'app-popular-articles',
  templateUrl: './popular-articles.component.html',
  styleUrls: ['./popular-articles.component.scss']
})
export class PopularArticlesComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.blogService.getTopArticles().subscribe(articles => {
      this.articles = articles;
    });
  }

  getImageUrl(imageName: string): string {
    return `assets/images/pages/${imageName}`;
  }
}
