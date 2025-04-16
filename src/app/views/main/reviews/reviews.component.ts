import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  reviews = [
    {
      name: 'Станислав',
      image: '../../../../assets/images/pages/reviews1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: '../../../../assets/images/pages/reviews2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают.'
    },
    {
      name: 'Мария',
      image: '../../../../assets/images/pages/reviews3.png',
      text: 'Команда АйтиШторма за короткое время сделала невозможное: из простой фирмы превратилась в мощный блог. Класс!!'
    },
    {
      name: 'Иван',
      image: '../../../../assets/images/pages/reviews1.png',
      text: 'Очень доволен! Сервис, подход, качество статей — всё на высоте. Рекомендую всем, кто хочет продвигать свой бренд.'
    },
  ];

  currentIndex = 0;

  get visibleReviews() {
    return this.reviews.slice(this.currentIndex, this.currentIndex + 3);
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  next() {
    if (this.currentIndex + 3 < this.reviews.length) {
      this.currentIndex += 1;
    }
  }
}
