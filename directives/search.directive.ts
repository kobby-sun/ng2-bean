import { Component, SimpleChange, Directive, ElementRef, Renderer, Input, Output, EventEmitter } from '@angular/core';
import * as util from '../util'

declare var $: any;

@Directive({
    selector: '[ui-search]'
})
export class UISearch {

    constructor(private element: ElementRef, renderer: Renderer) {

    }

    @Input() source: any;
    @Input() searching: boolean;
    @Output() valueUpdated = new EventEmitter();

    initDropdown = () => {
        if (this.source && this.source.length > 0) {
            let ds = this.source.map(s => { return { title: s } })
            $(this.element.nativeElement)
                .search('destroy');

            $(this.element.nativeElement)
                .search({
                    maxResults: 50,
                    source: ds,
                    searchDelay: 100,
                    searchFullText: true,
                    onSearchQuery: query => {
                        // console.log('onSearchQuery', query)
                    },
                    onResultsAdd: html => {
                        // console.log('onResultsAdd', html)
                    },
                    onSelect: (result, response) => {
                        // console.log('result', result)
                        // console.log('response', response)
                        this.valueUpdated.emit(result)
                    }
                });
        }

    }

    ngAfterViewInit() {
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
            this.initDropdown();
        }, false);

        this.initDropdown();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                this.initDropdown();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy() {
        $(this.element.nativeElement)
                .search('destroy');
    }
}
