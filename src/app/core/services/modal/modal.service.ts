// modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ModalConfig {
  showSelect: boolean;
  defaultService?: string;
  showConsultationBtn: boolean;
  formTitle: string;
  forceThanksTitle?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private modalConfigSubject = new BehaviorSubject<ModalConfig>({
    showSelect: true,
    defaultService: '',
    showConsultationBtn: false,
    formTitle: 'Оставить заявку',
    forceThanksTitle: false
  });

  isOpen$ = this.isOpenSubject.asObservable();
  modalConfig$ = this.modalConfigSubject.asObservable();

  openModal(config: ModalConfig) {
    this.modalConfigSubject.next({
      ...this.modalConfigSubject.value, // Сохраняем текущие значения
      ...config,                      // Применяем новые настройки
      formTitle: config.formTitle || 'Оставить заявку' // Дефолтный заголовок
    });
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
      formTitle: 'Оставить заявку',
      forceThanksTitle: false
    });
  }
}
