import { Component, Directive, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[ui-dropdown]'
})
export class UIDropdown {

    constructor(private element: ElementRef, renderer: Renderer) {

    }

    @Output() valueUpdated = new EventEmitter();

    ngAfterViewInit() {

        let initDropdown = () => {
            $(this.element.nativeElement).dropdown({
                onChange: (value) => {
                    this.valueUpdated.emit({ value: value, label: $(this.element.nativeElement).dropdown('get item', value).text() });
                }
            })
        }

        this.element.nativeElement.parentNode.addEventListener('DOMContentLoaded', () => {
            // console.log('DOMContentLoaded')
        }, false);
        this.element.nativeElement.parentNode.addEventListener('DOMSubtreeModified', () => {
            // console.log('DOMSubtreeModified')
        }, false);
        this.element.nativeElement.parentNode.addEventListener('DOMNodeInserted', () => {
            // console.log('DOMNodeInserted')
        }, false);
        this.element.nativeElement.parentNode.addEventListener('DOMCharacterDataModified', () => {
            // console.log('DOMCharacterDataModified')
            initDropdown();
        }, false);

        initDropdown();
    }

    ngOnChanges() {

    }
}
