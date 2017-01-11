import { Component, Directive, ElementRef, Renderer } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[table-expandable]'
})
export class TableExpandable {

    constructor(private element: ElementRef, renderer: Renderer) {

    }

    inited: boolean

    ngOnInit() {
        let toggleclick = (tr) => {
            tr.next('tr').toggle('fast', () => {
                let hidden = tr.next('tr').is(":hidden")
                let display = hidden ? 'none' : 'table-row'
                tr.next('tr').css('display', display)
                tr.find(".table-expandable-arrow").removeClass('glyphicon-chevron-down')
                tr.find(".table-expandable-arrow").removeClass('glyphicon-chevron-up')
                if (hidden) {
                    tr.find(".table-expandable-arrow").addClass('glyphicon-chevron-down')
                } else {
                    tr.find(".table-expandable-arrow").addClass('glyphicon-chevron-up')
                }
            });

            // tr.find(".table-expandable-arrow").toggleClass("glyphicon-chevron-down glyphicon-chevron-up");
        }

        let initTbl = () => {

            //@@@ nested mode
            $(this.element.nativeElement).parent().find('table').filter('.table-expandable').each(function () {
                let table = $(this)

                table.children('thead').children('tr').append('<th></th>');
                table.children('tbody').children('tr').filter(':odd').hide();
                table.children('tbody').children('tr').filter(':even').find('.table-row-toggle').click(function (e) {
                    e.stopPropagation()
                    var tr = $(this).closest('tr')
                    toggleclick(tr)
                });
                // table.children('tbody').children('tr').filter(':even').each(function () {
                //     var element = $(this);
                //     element.append('<td><div class="table-expandable-arrow"></div></td>');
                // });
                table.children('tbody').children('tr').filter(':even').find('.table-expandable-arrow').click(function (e) {
                    e.stopPropagation()
                    var tr = $(this).parent().parent()
                    toggleclick(tr)
                });

                // table.children('tbody').children('tr').filter(':odd').each(function () {
                //     let tr = $(this)

                //     //add style change event listener
                //     tr.change(function () {
                //         console.log("Handler for .change() called.");
                //     });
                // });
            });


            //@@@ single mode
            // let table = $(this.element.nativeElement).parent().parent();
            // // console.log(table)
            // // console.log(table.children('tbody').children('tr').length)

            // //table.children('thead').children('tr').append('<th></th>');
            // table.children('tbody').children('tr').filter(':odd').hide();
            // table.children('tbody').children('tr').filter(':even').find('.table-row-toggle').click(function () {
            //     let element = $(this);
            //     let tr = element.closest('tr')
            //     tr.next('tr').toggle('fast');
            //     //element.find(".table-row-toggle").toggleClass("up");
            // });
        }

        this.element.nativeElement.parentNode.addEventListener('DOMSubtreeModified', () => {
            // console.log('DOMSubtreeModified')
        }, false);
        this.element.nativeElement.parentNode.addEventListener('DOMNodeInserted', () => {
            // console.log('DOMNodeInserted')
        }, false);
        this.element.nativeElement.parentNode.addEventListener('DOMCharacterDataModified', () => {
            // console.log('DOMCharacterDataModified')
            if (!this.inited) {
                this.inited = true
                setTimeout(() => {
                    initTbl()
                });
            }
        }, false);



        // let observer = new MutationObserver(mutations => {
        //     mutations.forEach((mutation) => {
        //         console.log(mutation);

        //         if (mutation.type == 'characterData') {
        //                initTbl()
        //         }
        //     });
        // });
        // let config = { attributes: true, childList: true, characterData: true };
        // observer.observe(this.element.nativeElement.parentNode, config);
    }

    ngAfterViewInit() {

    }

    ngOnChanges() {
        // console.info('ngOnChanges');
    }
}
