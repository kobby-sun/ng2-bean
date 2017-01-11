import { Pipe, PipeTransform } from '@angular/core';
var numeral = require('numeral');

@Pipe({ name: 'numeral' })
export class NumeralPipe implements PipeTransform {
    transform(value: number, exponent: string): string {
        var string = numeral(value).format(exponent || '0.00');
        return string;
    }
}