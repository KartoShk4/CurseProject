import {Component} from '@angular/core';
import {ModalService} from "../../../core/modal/modal.service";
import {SliderType} from "../../../../type/slider.type";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  currentSlide: number = 0;
  isModalOpen: boolean = false;

  constructor(private modalService: ModalService) {
  }

  slides: SliderType[] = [
    {
      image: '../../../../assets/images/pages/slides/slide1.png',
      pretitle: 'Предложение месяца',
      titleParts: [
        { text: 'Продвижение в Instagram для вашего бизнеса', isHighlighted: false },
        { text: ' -15%', isHighlighted: true },
        { text: '!', isHighlighted: false }
      ],
      text: '',
      serviceTitle: 'Продвижение'
    },
    {
      image: '../../../../assets/images/pages/slides/slide2.png',
      pretitle: 'Акция',
      titleParts: [
        { text: 'Нужен грамотный', isHighlighted: false },
        { text: ' копирайтер', isHighlighted: true },
        { text: '?', isHighlighted: false }
      ],
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      serviceTitle: 'Копирайтинг'
    },
    {
      image: '../../../../assets/images/pages/slides/slide3.png',
      pretitle: 'Новость дня',
      titleParts: [
        { text: '6 место ', isHighlighted: true },
        { text: 'в ТОП-10 SMM-агенств Москвы', isHighlighted: false },
        { text: '!', isHighlighted: false }
      ],
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      serviceTitle: 'Реклама'
    },
  ];


  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  openModal(): void {
    const currentSlide: SliderType = this.slides[this.currentSlide];

    this.modalService.openModal({
      showSelect: true,
      defaultService: currentSlide.serviceTitle,
      showConsultationBtn: false,
      formTitle: 'Оставить заявку'
    });
  }


  closeModal(): void {
    this.isModalOpen = false;
  }
}
