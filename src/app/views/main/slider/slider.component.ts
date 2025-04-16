import {Component} from '@angular/core';
import {ModalService} from "../../../core/modal/modal.service";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  currentSlide = 0;
  isModalOpen = false;

  constructor(private modalService: ModalService) {
  }

  slides = [
    {
      image: '../../../../assets/images/pages/slides/slide1.png',
      pretitle: 'Предложение месяца',
      titleParts: [
        { text: 'Продвижение в Instagram для вашего бизнеса', isHighlighted: false },
        { text: ' -15%', isHighlighted: true },
        { text: '!', isHighlighted: false }
      ],
      text: ''
    },
    {
      image: '../../../../assets/images/pages/slides/slide2.png',
      pretitle: 'Акция',
      titleParts: [
        { text: 'Нужен грамотный', isHighlighted: false },
        { text: ' копирайтер', isHighlighted: true },
        { text: '?', isHighlighted: false }
      ],
      text: 'Весь декабрь у нас действует акция на работу копирайтера.'
    },
    {
      image: '../../../../assets/images/pages/slides/slide3.png',
      pretitle: 'Новость дня',
      titleParts: [
        { text: '6 место ', isHighlighted: true },
        { text: 'в ТОП-10 SMM-агенств Москвы', isHighlighted: false },
        { text: '!', isHighlighted: false }
      ],
      text: 'Мы благодарим каждого, кто голосовал за нас!'
    },
  ];

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  openModal() {
    this.modalService.openModal({
      showSelect: true,
      // defaultService: service,
      showConsultationBtn: false,
      formTitle: 'Оставить заявку'
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
