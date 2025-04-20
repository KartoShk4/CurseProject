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
  isLoadingComments: boolean = false; // загрузка
  hasMoreComments: boolean = true; // есть ли ещё
  commentsPerPage: number = 10; // шаг загрузки (после первых 3)
  initialLoadCount: number = 3; // первые 3 комментария
  initialLoad: boolean = true;
  allComments: CommentType[] = [];




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
        this.article = article;
        this.articleId = article.id;

        // загружаем ВСЕ комментарии
        this.blogService.getComments(this.articleId, 0).subscribe(comments => {
          this.allComments = comments;

          this.comments = this.allComments.slice(0, this.initialLoadCount);
          this.offset = this.initialLoadCount;

          if (this.offset >= this.allComments.length) {
            this.hasMoreComments = false;
          }
        });
      });
    }
  }



  loadComments(): void {
    const next = this.allComments.slice(this.offset, this.offset + this.commentsPerPage);
    this.comments = [...this.comments, ...next];
    this.offset += next.length;

    if (this.offset >= this.allComments.length) {
      this.hasMoreComments = false;
    }
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
