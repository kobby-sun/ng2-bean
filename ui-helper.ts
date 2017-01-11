import { ElementRef } from '@angular/core';

declare var $: any;

export function initTblExpandable(ele: ElementRef) {
    setTimeout(() => {
        let table = $(ele.nativeElement)
        // console.log(table)

        //table.children('thead').children('tr').append('<th></th>');
        table.children('tbody').children('tr').filter(':odd').hide();
        table.children('tbody').children('tr').filter(':even').find('.table-row-toggle').click(function () {
            var element = $(this);
            var tr = element.closest('tr')
            tr.next('tr').toggle('fast');
            //element.find(".table-row-toggle").toggleClass("up");
        });
    });
}