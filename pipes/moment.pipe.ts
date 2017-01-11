import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
    transform(value: any, informat: string, outformat: string, utc: boolean): string {
        if (value == null || value == '') return ''
        if (utc)
            return moment.utc(value, informat || 'YYYY-MM-DD hh:mm A').local().format(outformat || 'YYYY-MM-DD hh:mm A');
        else
            return moment(value, informat || 'YYYY-MM-DD hh:mm A').format(outformat || 'YYYY-MM-DD hh:mm A');
    }
}