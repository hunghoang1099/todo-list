import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  public newFormGroup: FormGroup;
  public formGroup: FormGroup;
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
    this.saveDataToDB();
  }

  public onUpdate(event: { task: Task; index: number }) {
    this.f.formArray['controls'][event.index]?.patchValue(event.task);
    this.saveDataToDB();
  }

  public onRemoveByDoHomework() {
    this.f.formArray.controls = this.f.formArray.controls.filter((control: any, index: number) => !control.value.isDoHomework);
    this.saveDataToDB();
  }

  public isBulk() {
    return this.formGroup.value.formArray.some((f: Task) => f.isDoHomework);
  }

  public onDone() {
    alert('Done!');
  }

  public saveDataToDB() {
    localStorage.setItem('database', JSON.stringify(this.formGroup.value));
  }

  private getDataFromDB() {
    const data = localStorage.getItem('database');
    return data ? JSON.parse(data).formArray : [];
  }
}
