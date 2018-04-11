import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

    transform(value: string, args?: any): any {
        if (!value) {
            return '';
        } else {
            return _.capitalize(value);
        }
    }

}
