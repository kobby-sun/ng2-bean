import { Component, SimpleChange, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as util from '../util'

import { BaseUIComponent } from "./ui-component";

declare var $;
declare var _;

const INPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UIInputComponent),
    multi: true
};

@Component({
    selector: 'ui-input',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUT_VALUE_ACCESSOR],
    template: `
    <div [class.error]="isErr"
            class="ui right labeled input fluid"
            [class.right]="!readonly" [class.labeled]="!readonly"
            >
        <input #uiComponent (ngModelChange)="textChange($event)"
            [attr.readonly]="readonly" [attr.disabled]="disabled"
            type="text" 
            [placeholder]="placeholder || ''" [ngModel]="value" />
        <div *ngIf="!readonly" class="ui basic label"><i class="fa fa-pencil" aria-hidden="true"></i></div>
    </div>
    `
})
export class UIInputComponent extends BaseUIComponent {
    // @Input() value;

    @Input() settings: any;

    @Input() isErr: boolean;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Output() valueUpdated = new EventEmitter();

    id: string = util.uuid()

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    textChange(evt) {
        let changed = this.value != evt
        if (changed) {
            this.value = evt
            this.valueUpdated.emit(evt)
        }
    }

    onChange(value: any) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

    }

    ngOnDestroy() {

    }
}
