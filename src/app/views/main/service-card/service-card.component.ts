import { Component } from '@angular/core';
import { ModalService } from "../../../core/modal/modal.service";
import {ServiceType} from "../../../../type/service.type";
import {SERVICES} from "../../../shared/data/services.data";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {

  services: ServiceType[] = SERVICES;

  constructor(private modalService: ModalService) {}

  openServiceModal(service: ServiceType): void {
    this.modalService.openModal({
      showSelect: true,
      defaultService: service.title,  // Передаем title выбранной услуги
      showConsultationBtn: false,
      formTitle: 'Оставить заявку'
    });
  }
}
