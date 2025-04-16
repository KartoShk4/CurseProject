import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/core/blog/blog.service';
import { Article } from 'src/app/models/article.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: Article[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getArticles().subscribe(response => {
      this.articles = response.items;
    });
  }
}
