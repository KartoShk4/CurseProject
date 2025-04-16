import {ModalComponent} from "./components/modal/modal.component";
import {TruncateWordsPipe} from "./pipes/truncate.pipe";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ModalComponent,
    TruncateWordsPipe
  ],
  exports: [
    ModalComponent,
    TruncateWordsPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
