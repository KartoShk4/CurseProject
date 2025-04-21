// modal.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

// Интерфейс для конфигурации модального окна
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
  // Состояние открытия модального окна и конфигурация
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private modalConfigSubject = new BehaviorSubject<ModalConfig>({
    showSelect: true,
    defaultService: '',
    showConsultationBtn: false,
    formTitle: 'Оставить заявку',
    forceThanksTitle: false
  });

  // Наблюдаемое состояние и конфигурация
  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  modalConfig$: Observable<ModalConfig> = this.modalConfigSubject.asObservable();

  // Открытие модального окна с конфигурацией
  openModal(config: ModalConfig): void {
    this.modalConfigSubject.next({
      ...this.modalConfigSubject.value,
      ...config,
      formTitle: config.formTitle || 'Оставить заявку'
    });
    this.isOpenSubject.next(true);
  }

  // Закрытие модального окна
  closeModal(): void {
    this.isOpenSubject.next(false);
  }

  // Сброс конфигурации модального окна
  resetToDefault(): void {
    this.modalConfigSubject.next({
      showSelect: true,
      defaultService: '',
      showConsultationBtn: false,
      formTitle: 'Оставить заявку',
      forceThanksTitle: false
    });
  }
}
