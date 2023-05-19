import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(formGroup: FormGroup[], ...args: any[]): any {
    const searchText = args[0][0] as string;
    const rejectMode = args[0][1] == 'new';
    if (rejectMode || searchText === '') {
      return formGroup;
    } else {
      const isOk = formGroup.filter(f => f.value?.doHomework?.includes(searchText) ? f : false);
      return isOk ? isOk : null;
    }
  }

}
