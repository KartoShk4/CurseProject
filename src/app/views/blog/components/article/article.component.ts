import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../../core/blog/blog.service';
import { Article } from '../../../../models/article.models';
import {AuthService} from "../../../../core/auth/auth.service";
import {Observable} from "rxjs";
import {CommentType} from "../../../../../type/comment.type";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article!: Article;
  relatedArticles: Article[] = [];
  comments: CommentType[] = [];
  isLogged$: Observable<boolean>;
  newCommentText: string = '';
  articleId!: string;
  articleUrl!: string;
  offset: number = 0;


  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
  ) {
    this.isLogged$ = this.authService.isLogged$;
  }

  ngOnInit(): void {
    const url = this.route.snapshot.paramMap.get('url');
    if (url) {
      this.blogService.getArticleByUrl(url).subscribe((article) => {
        console.log('Loaded article:', article);
        this.article = article;
        this.articleId = article.id;

        // Загружаем связанные статьи только после загрузки основной
        this.blogService.getRelatedArticles(this.article.url).subscribe((related) => {
          this.relatedArticles = related;
        });
      });
    }
  }

  loadComments(): void {
    this.blogService.getComments(this.articleId, this.offset).subscribe(comments => {
      this.comments = [...this.comments, ...comments];
      this.offset += comments.length;
    });
  }

  addComment(): void {
    if (!this.newCommentText.trim()) return;

    if (!this.articleId) {
      console.warn('Article ID is not set yet');
      return;
    }

    this.blogService.addComment(this.articleId, this.newCommentText).subscribe(response => {
      if (!response.error) {
        this.newCommentText = '';
        this.offset = 0;
        this.comments = []; // сброс
        this.loadComments(); // перезагрузка с новым комментом
      }
    });
  }
}
