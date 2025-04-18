import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../core/blog/blog.service';
import { Article } from '../../../../models/article.models';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];


  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const url = this.route.snapshot.paramMap.get('url');
    if (url) {
      this.blogService.getArticleByUrl(url).subscribe((article) => {
        console.log('Loaded article:', article);
        this.article = article;

        // Загружаем связанные статьи только после загрузки основной
        this.blogService.getRelatedArticles(this.article.url).subscribe((related) => {
          this.relatedArticles = related;
        });
      });
    }
  }


  protected readonly url = module
}
