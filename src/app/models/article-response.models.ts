import {Article} from "./article.models";

export interface ArticleResponse {
  count: number;
  pages: number;
  items: Article[];
}
