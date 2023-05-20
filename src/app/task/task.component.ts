import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortOrder, Task } from '../model/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  public newFormGroup: FormGroup;
  public formGroup: FormGroup;
  public sortOrder: SortOrder = 'asc';
  public searchText = '';

  constructor(private fb: FormBuilder) {
    this.newFormGroup = this.fb.group({
      formArray: this.fb.array([this.init()]),
    });
    this.formGroup = this.fb.group({
      formArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const tasks = this.getDataFromDB();
    tasks.forEach((task: Task) => {
      this.onCreate(task);
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  public init(task?: Task): FormGroup {
    return this.fb.group({
      isDetail: [task?.isDetail ?? false],
      isDoHomework: [task?.isDoHomework ?? true],
      doHomework: [task?.doHomework, [Validators.required]],
      description: [task?.description],
      dueDate: [task?.dueDate ?? new Date().toISOString().split('T')[0]],
      priority: [task?.priority ?? 'normal'],
    });
  }

  public onCreate(task: Task) {
    const control = <FormArray>this.f.formArray;
    control.push(this.init(task));
    this.sort();
    this.saveDataToDB();
  }

  public onUpdate() {
    this.sort();
    this.saveDataToDB();
  }

  public onRemoveByDoHomework() {
    const remove = () => {
      this.formGroup.value.formArray.forEach((f: Task, i: number) => f.isDoHomework && this.f.formArray.removeAt(i));
      this.isBulk() && remove();
    }
    remove();
    this.saveDataToDB();
  }

  public isBulk() {
    return this.formGroup.value.formArray.some((f: Task) => f.isDoHomework);
  }

  public onDone() {
    alert('Done!');
  }

  public sort() {
    const controls = this.f.formArray.controls.sort((a: FormGroup, b: FormGroup) => {
      const dateA = new Date(a.value.dueDate).getTime();
      const dateB = new Date(b.value.dueDate).getTime();
      const titleA = a.value.doHomework;
      const titleB = b.value.doHomework;
      if (dateA < dateB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      } else if (dateA > dateB) {
        return this.sortOrder === 'desc' ? 1 : -1;
      } else {
        if (titleA < titleB) {
          return this.sortOrder === 'asc' ? 1 : -1;
        } else if (titleA > titleB) {
          return this.sortOrder === 'desc' ? 1 : -1;
        } {
          return this.sortOrder === 'desc' ? 1 : -1;
        }
      }
    });
    this.f.formArray.patchValue(controls);
  }

  public saveDataToDB() {
    localStorage.setItem('database', JSON.stringify(this.formGroup.value));
  }

  private getDataFromDB() {
    const data = localStorage.getItem('database');
    return data ? JSON.parse(data).formArray : [];
  }
}
