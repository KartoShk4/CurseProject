import {Article} from "../app/models/article.models";

export type ArticleResponse = {
  count: number;
  pages: number;
  items: Article[];
}
