import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Category, Request } from '../../../core/services/api.service';
import { ModalService } from '../../../core/modal/modal.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {SERVICES} from "../../data/services.data";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  serviceTitles: string[] = SERVICES.map(service => service.title);

  formModal: FormGroup;
  categories: Category[] = [];
  showThanks: boolean = false;
  isOpen$: Observable<boolean>;
  modalConfig$: Observable<{
    showSelect: boolean;
    defaultService?: string;
    showConsultationBtn: boolean;
    formTitle: string;
  }>;

  private destroy$ = new Subject<void>(); // Subject для отписки

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public modalService: ModalService
  ) {
    this.formModal = this.fb.group({
      service: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,12}$/)]],
    });

    this.isOpen$ = this.modalService.isOpen$;
    this.modalConfig$ = this.modalService.modalConfig$;
  }

  ngOnInit(): void {
    // Обрабатываем конфигурацию модалки
    this.modalConfig$
      .pipe(takeUntil(this.destroy$)) // отписка на уничтожение компонента
      .subscribe(config => {
        if (config.defaultService) {
          this.formModal.patchValue({ service: config.defaultService });  // Подставляем выбранное значение
        }

        if (config.showSelect) {
          // Делаем поле service обязательным
          this.formModal.get('service')?.setValidators([Validators.required]);
          this.formModal.get('service')?.updateValueAndValidity();
        }
      });
  }

  ngOnDestroy(): void {
    // Завершаем все подписки, когда компонент уничтожается
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.showThanks = false;
    this.formModal.reset();
    this.formModal.patchValue({ service: '' });
  }

  submitForm(): void {
    if (this.formModal.valid) {
      const request: Request = {
        name: this.formModal.value.name,
        phone: this.formModal.value.phone,
        service: this.formModal.value.service,
        type: 'order'
      };

      this.apiService.createRequest(request).subscribe(() => {
        this.showThanks = true;
      });
    }
  }
}
