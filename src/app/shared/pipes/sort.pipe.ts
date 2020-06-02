import { Pipe, PipeTransform } from '@angular/core';
import { IBike } from '../interfaces/bike.interface';
import { IComponent } from '../interfaces/component.interface';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(arrAll: IBike[] | IComponent[], sort: string, way: boolean, pagination: number): IBike[] | IComponent[] {
    if (arrAll) {
      arrAll.sort(function (a, b) {
        let value1 = a[sort]
        let value2 = b[sort]
        if (value1 < value2) {
          if(way){
            return -1;
          }
          else{
            return 1
          }
        }
        if (value1 > value2) {
          if(way){
            return 1;
          }
          else{
            return -1
          }
        }
        return 0;
      })
      return arrAll.slice(0,pagination);
    }
  }
}
