import { Component, Directive, ElementRef, Renderer, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[ui-accordion]'
})
export class UIAccordion {

    constructor(private element: ElementRef, renderer: Renderer) {

    }

    @Input() exclusive: boolean = true;

    @Output() valueUpdated = new EventEmitter();

    ngAfterViewInit() {

        let initAccordion = () => {
            $(this.element.nativeElement).accordion({
                exclusive: this.exclusive,
                onOpen: () => {
                    this.valueUpdated.emit(true);
                },
                onClose: () => {
                    this.valueUpdated.emit(false);
                }
            })
        }

        initAccordion();
    }

    ngOnChanges() {

    }
}
