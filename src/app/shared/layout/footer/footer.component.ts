import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../core/modal/modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  // footer.component.ts
  openConsultationModal() {
    this.modalService.openModal({
      showSelect: false,
      defaultService: 'Консультация',
      showConsultationBtn: true,
      formTitle: 'Закажите бесплатную консультацию!',
      forceThanksTitle: true
    });
  }
}
