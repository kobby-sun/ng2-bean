import { Component, ViewChild, ElementRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';

import { forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { BaseUIComponent } from "./ui-component"
import * as util from '../util'


declare var $;

const UI_SEARCH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UISearchComponent),
    multi: true
};

@Component({
    selector: 'ui-search',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UI_SEARCH_VALUE_ACCESSOR],
    template: `
            <div #uiSearch class="ui search" 
                    [class.error]="isErr" [class.disabled]="disabled"
                    >
                        <input (keypress)="change($event)"
                            [(ngModel)]="value" 
                            class="prompt" type="text" 
                            [placeholder]="placeholder || ''"
                            >
                        <div class="results"></div>
                </div>
    `
})
export class UISearchComponent extends BaseUIComponent {
    // @Input() value: boolean = false;

    @Input() disabled: boolean = false;

    @Input() settings: any;

    @Input() isErr: boolean;

    @Input() placeholder: string;

    get source() {
        return this.settings != null ? this.settings.ds : null;
    }

    @Output() valueUpdated = new EventEmitter();

    @ViewChild('uiSearch') element: ElementRef;

    id: string = util.uuid()

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    init() {
        setTimeout(() => {
            if (this.source && this.source.length > 0) {
                let ds = this.source.map(s => { return { title: s } })
                $(this.element.nativeElement)
                    .search('destroy');

                $(this.element.nativeElement)
                    .search({
                        maxResults: 30,
                        source: ds,
                        searchDelay: 50,
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
                            let res = Object.assign(result, { type: 'onselect' })
                            this.value = res.title
                            this.valueUpdated.emit(res)
                        }
                    });
            }
            // this.cd.markForCheck()
        })
    }

    change(evt) {
        this.valueUpdated.emit(evt)
    }

    ngAfterViewInit() {
        // console.log('ToggleComponent ngAfterViewInit');
        // this.cd.detectChanges()
        this.init();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                // console.log('ToggleComponent ngOnChanges');
                // this.cd.detectChanges();
                this.init();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy() {
        //destroy dom and set disposed flag, @@Don't know why Angular didn't dispose it ...
        $(this.element.nativeElement)
            .search('destroy');
    }
}