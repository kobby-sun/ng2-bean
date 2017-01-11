import { Component, ViewChild, ElementRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';

import { forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { BaseUIComponent } from "./ui-component"
import * as util from '../util'


declare var $;

const UI_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
};

@Component({
    selector: 'ui-checkbox',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UI_CHECKBOX_VALUE_ACCESSOR],
    template: `
            <div #checkbox class="ui checkbox" [class.disabled]="disabled">
                <input type="checkbox" [(ngModel)]="value">
                <label *ngIf="label" [style.fontSize]="size ? size : '14px'" [style.fontWeight]="bold ? 'bold' : 'normal'">{{label}}</label>
            </div>
    `
})
export class CheckboxComponent extends BaseUIComponent {
    // @Input() value: boolean = false;
    @Input() disabled: boolean = false;
    @Input() settings: any;
    @Input() label: string;
    @Output() valueUpdated = new EventEmitter();

    @ViewChild('checkbox') checkbox: ElementRef;

    id: string = util.uuid()

    get bold(): boolean {
        return this.settings && this.settings.bold
    }
    get size(): boolean {
        return this.settings && this.settings.size
    }

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    init() {
        setTimeout(() => {
            let ele = this.checkbox.nativeElement

            $(ele).checkbox({
                onChange: (value) => {
                    this.valueUpdated.emit(value);
                }
            });
            // this.cd.markForCheck()
        })
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

    }
}