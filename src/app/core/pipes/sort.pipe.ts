import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(array: any[], field: string, ascending: boolean = true): any[] {
    if (!array || !field) {
      return array;
    }

    const sortedArray = array.slice(); // Create a shallow copy of the array

    sortedArray.sort((a, b) => {
      const valueA = this.getPropertyValue(a, field);
      const valueB = this.getPropertyValue(b, field);

      if (valueA < valueB) {
        return ascending ? -1 : 1;
      } else if (valueA > valueB) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });

    return sortedArray;
  }

  private getPropertyValue(object: any, field: string): any {
    if (typeof object[field] === 'undefined') {
      return null;
    }

    return object[field];
  }
}
