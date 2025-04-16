// modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private modalConfigSubject = new BehaviorSubject<{
    showSelect: boolean;
    defaultService?: string;
    showConsultationBtn: boolean;
    formTitle: string;
  }>({
    showSelect: true,
    defaultService: '',
    showConsultationBtn: false,
    formTitle: 'Оставить заявку'
  });

  isOpen$ = this.isOpenSubject.asObservable();
  modalConfig$ = this.modalConfigSubject.asObservable();

  openModal(config: {
    showSelect: boolean;
    defaultService?: string;
    showConsultationBtn: boolean;
    formTitle: string;
  }) {
    this.modalConfigSubject.next(config);
    this.isOpenSubject.next(true);
  }

  closeModal() {
    this.isOpenSubject.next(false);
  }

  resetToDefault() {
    this.modalConfigSubject.next({
      showSelect: true,
      defaultService: '',
      showConsultationBtn: false,
      formTitle: 'Оставить заявку'
    });
  }
}
