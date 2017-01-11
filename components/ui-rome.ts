import { Component, SimpleChange, ViewChild, ElementRef, Input, Output, EventEmitter  } from '@angular/core';
import * as moment from 'moment';
import {ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';

import {forwardRef} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import * as util from '../util'

import { BaseUIComponent} from "./ui-component";

const rome = require('rome')

declare var $;
declare var _;

const DT_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatetimePickerComponent),
    multi: true
};    

@Component({
    selector: 'datetime-picker',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DT_PICKER_VALUE_ACCESSOR],
    template: `
        <div class='ui right labeled input fluid' [class.error]="isErr">
            <input #datetimepicker1 type='text' [(ngModel)]="value" />
            <div class="ui basic label">
                <span *ngIf="!(options.date != null && !options.date)" class="glyphicon glyphicon-calendar"></span>
                <span *ngIf="options.date != null && !options.date" class="glyphicon glyphicon-time"></span>
            </div>
        </div>
    `
})
class DatetimePickerComponent extends BaseUIComponent {
    // @Input() value;
    @Input() options: any = {};
    @Input() isErr: boolean;
    @Output() valueUpdated = new EventEmitter();

    private moment = moment
    inited: boolean = false;
    id: string = util.uuid()

    @ViewChild('datetimepicker1') dateTimePicker: ElementRef;

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    getOpts() {
        let opts = {}
        if (this.options) {
            opts = Object.assign(opts, this.options)
        }
        return opts;
    }

    init() {
        setTimeout(() => {
            // this.inited = false;

            let ele = this.dateTimePicker.nativeElement
            let opts = this.getOpts()

            rome(ele).refresh()
            rome(ele).options(opts)
            rome(ele).on('data', (value) => {
                if (value == this.value) return;
                this.value = value;
                this.valueUpdated.emit(this.value)
                // console.log(this)
            });

            // this.cd.markForCheck()
            // this.inited = true;
        });
    }

    onChange(value: any) {
        // console.info('DatetimePickerComponent value onChange', this)
        // this.cd.detectChanges();
        this.init()
    }

    ngOnInit() {
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        // console.log('DatetimePickerComponent ngAfterViewInit');
        // this.cd.detectChanges();
        this.init();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                // console.log('DatetimePickerComponent ngOnChanges')
                // this.cd.detectChanges();
                this.init();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }
        }
    }

    ngOnDestroy() {
        // console.log('dispose ui rome')
        rome(this.dateTimePicker.nativeElement).destroy()
    }
}

export const DTPICKER_DIRECTIVES: Array<any> = [
    DatetimePickerComponent
];

export default {
    directives: [
        DTPICKER_DIRECTIVES
    ]
};