import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() title = 'New Task';
  @Input() mode: 'new' | 'edit' = 'new';
  @Input() sortOrder = 'asc';
  @Input() searchText = '';
  @Input() formGroup!: FormGroup;

  @Output() submit = new EventEmitter();
  @Output() saveDB = new EventEmitter();

  get f(): any { return this.formGroup.controls; }

  onDetail(X: FormGroup<any>) {
    X.patchValue({ isDetail: !X['controls']['isDetail']?.value });
    this.saveDB.emit();
  }

  onDelete(index: number) {
    this.f.formArray.removeAt(index);
    this.saveDB.emit();
  }

  onSubmit(index?: number) {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      if (this.mode === 'new') {
        this.submit.emit(this.formGroup.value.formArray[0]);
        this.formGroup.reset();
        this.f['formArray']['controls'][0].patchValue({priority: 'normal'})
        this.f['formArray']['controls'][0].patchValue({dueDate: new Date().toISOString().split('T')[0]})
      } else {
        this.submit.emit();
      }
    }
  }
}
