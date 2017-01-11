import { Component, SimpleChange, ViewChild, ElementRef, Input, Output, EventEmitter  } from '@angular/core';
import * as moment from 'moment';
import * as util from '../util'
import {ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';

import { forwardRef} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

import { BaseUIComponent} from "./ui-component";

declare var $;
declare var _;

const DT_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatetimePickerComponent),
    multi: true
};
const D_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
};
const T_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
};

abstract class BaseDatetimePickerComponent extends BaseUIComponent {

    abstract defaultFormat(): string;

    protected initChangeHandler(component: any) {
        let timer;
        let self = this;
        $(component.dateTimePicker.nativeElement).on('keyup', (evt) => {
            let value = evt.target.value
            component.cd.detectChanges();

            let val = (value == null || value == '' || !moment(value, component.options.format || component.defaultFormat()).isValid()) ? null : moment(value, component.options.format || component.defaultFormat());
            component.value = val;
            component.valueUpdated.emit(val);
        });
    }

    protected initPicker(component: any, value: any, options: any, valueUpdated: EventEmitter<any>, mode: string) {
        setTimeout(() => {

            let self = this
            let opts: any = {}

            component.inited = false;

            if (options) {
                opts = Object.assign(options, opts)
            }
            if (!opts.format) {
                opts = Object.assign({ format: this.defaultFormat() }, opts)
            }

            if (value != null && value != '' && moment(value, opts.format).isValid()) {
                opts = Object.assign({ startDate: moment(value, opts.format) }, opts)
            }

            opts = Object.assign({
                singleDatePicker: true,
                datePicker: mode != 'time' ? true : false,
                timePicker: mode == 'time' || mode == 'datetime' ? true : false,
                timePickerIncrement: 1,
                showDropdowns: true
            }, opts)

            $(component.dateTimePicker.nativeElement).daterangepicker(opts,
                function (start, end, label) {
                    console.log('daterangepicker onchanged', start)

                    let value = start
                    let val = (value == null || value == '' || !moment(value, component.options.format || component.defaultFormat()).isValid()) ? null : moment(value, component.options.format || component.defaultFormat());

                    component.value = val;
                    valueUpdated.emit(val);
                }
            )

            component.cd.markForCheck()
            component.inited = true;
        })
    }
}

@Component({
    selector: 'date-picker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [D_PICKER_VALUE_ACCESSOR],
    template: `
    <span [hidden]="inited">loading...</span>
    <div [hidden]="!inited">
    <div class="ui right labeled input fluid" [class.error]="isErr">
                            <input type="text" [value]="value && moment(value, options.format || defaultFormat()).isValid() ? (moment(value, options.format || defaultFormat()).format(options.format || defaultFormat())) : ''" #datetimepicker1>
                            <div class="ui basic label">
                                <i class="fa fa-calendar" aria-hidden="true"></i>
                            </div>
                        </div></div>
    `
})
class DatePickerComponent extends BaseDatetimePickerComponent {
    // @Input() value;
    @Input() options: any = {};
    @Input() isErr: boolean;
    @Output() valueUpdated = new EventEmitter();

    private moment = moment
    inited: boolean = false;

    defaultFormat() {
        return 'YYYY-MM-DD'
    }

    mode() {
        return 'date'
    }

    @ViewChild('datetimepicker1') dateTimePicker: ElementRef;

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
        this.initPicker(this, this.value, this.options, this.valueUpdated, 'date');
        this.initChangeHandler(this)
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                this.cd.detectChanges();
                this.initPicker(this, this.value, this.options, this.valueUpdated, 'date');
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy(){

    }
}

@Component({
    selector: 'datetime-picker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DT_PICKER_VALUE_ACCESSOR],
    template: `
    <span [hidden]="inited">loading...</span>
    <div [hidden]="!inited">
    <div class="ui right labeled input fluid" [class.error]="isErr">
                            <input type="text" [value]="value && moment(value, options.format || defaultFormat()).isValid() ? (moment(value, options.format || defaultFormat()).format(options.format || defaultFormat())) : ''" #datetimepicker1>
                            <div class="ui basic label">
                                <i class="fa fa-calendar" aria-hidden="true"></i>
                            </div>
                        </div></div>
    `
})
class DatetimePickerComponent extends BaseDatetimePickerComponent {
    // @Input() value;
    @Input() options: any = {};
    @Input() isErr: boolean;
    @Output() valueUpdated = new EventEmitter();

    private moment = moment
    inited: boolean = false;

    defaultFormat() {
        return 'YYYY-MM-DD hh:mm A'
    }

    mode() {
        return 'datetime'
    }

    @ViewChild('datetimepicker1') dateTimePicker: ElementRef;

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    ngAfterViewInit() {
        console.log('DatePickerComponent ngAfterViewInit');
        this.cd.detectChanges();
        this.initPicker(this, this.value, this.options, this.valueUpdated, 'datetime');
        this.initChangeHandler(this)
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                this.cd.detectChanges();
                this.initPicker(this, this.value, this.options, this.valueUpdated, 'datetime');
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy(){
        
    }
}

@Component({
    selector: 'time-picker',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [T_PICKER_VALUE_ACCESSOR],
    template: `
    <span [hidden]="inited">loading...</span>
    <div [hidden]="!inited">
    <div class="ui right labeled input fluid" [class.error]="isErr">
                            <input type="text" [value]="value && moment(value, options.format || defaultFormat()).isValid() ? (moment(value, options.format || defaultFormat()).format(options.format || defaultFormat())) : ''" #datetimepicker1>
                            <div class="ui basic label">
                                <i class="fa fa-clock-o" aria-hidden="true"></i>
                            </div>
                        </div></div>
    `
})
class TimePickerComponent extends BaseDatetimePickerComponent {
    // @Input() value;
    @Input() options: any = {};
    @Input() isErr: boolean;
    @Output() valueUpdated = new EventEmitter();

    private moment = moment
    inited: boolean = false;

    defaultFormat() {
        return 'hh:mm A';
    }

    mode() {
        return 'time'
    }

    @ViewChild('datetimepicker1') dateTimePicker: ElementRef;

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
        this.initPicker(this, this.value, this.options, this.valueUpdated, 'time');
        this.initChangeHandler(this)
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                this.cd.detectChanges();
                this.initPicker(this, this.value, this.options, this.valueUpdated, 'time');
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy(){
        
    }
}

export const DTPICKER_DIRECTIVES: Array<any> = [
    DatePickerComponent, TimePickerComponent, DatetimePickerComponent
];

export default {
    directives: [
        DTPICKER_DIRECTIVES
    ]
};