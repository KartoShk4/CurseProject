import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Category, Request } from '../../../core/services/api.service';
import { ModalService } from '../../../core/modal/modal.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SERVICES } from "../../data/services.data";

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
  modalConfig$: Observable<any>;
  modalConfig: any;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public modalService: ModalService,
    private cdr: ChangeDetectorRef
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
    this.modalConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.modalConfig = config; // Сохраняем конфигурацию

        if (config.defaultService) {
          this.formModal.patchValue({ service: config.defaultService });
        }

        if (config.showSelect) {
          this.formModal.get('service')?.setValidators([Validators.required]);
          this.formModal.get('service')?.updateValueAndValidity();
        }

        // Форсируем обновление шаблона
        this.cdr.detectChanges();
      });
  }

  // Остальные методы остаются без изменений
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal(): void {
    this.modalService.closeModal();
    this.modalService.resetToDefault();
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
