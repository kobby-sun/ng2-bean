import { Component, SimpleChange, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as util from '../util'

import { BaseUIComponent } from "./ui-component";

const Flatpickr = require("flatpickr");

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
            <input [id]="id" #datetimepicker1 type='text' [(ngModel)]="value" />
            <div class="ui basic label">
                <span *ngIf="!(options.date != null && !options.date)" class="fa fa-calendar"></span>
                <span *ngIf="options.date != null && !options.date" class="fa fa-clock-o"></span>
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
    dt: any

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

    getDateFormat(opts) {
        if (opts.date != null && !opts.date)
            return 'h:i K'
        if (!opts.time)
            return 'Y-m-d'
        return 'Y-m-d h:i K'
    }

    init() {
        setTimeout(() => {
            // this.inited = false;

            // let ele = this.dateTimePicker.nativeElement
            let opts: any = this.getOpts()

            opts = Object.assign(opts, {
                dateFormat: this.getDateFormat(opts),
                enableTime: opts.time,
                noCalendar: opts.date != null && !opts.date,
                onChange: (selectedDates, dateStr, instance) => {
                    // console.log('onChange', selectedDates, selectedDates.length > 0, this.id)
                    setTimeout(() => this.valueUpdated.emit(selectedDates[0]))
                    this.value = selectedDates[0]
                }
            })

            // console.log('this.init', this.value, this.id)

            if (this.value) {
                opts = Object.assign(opts, {
                    defaultDate: this.value
                })
            }

            if (opts.min) {
                opts = Object.assign(opts, {
                    minDate: opts.min
                })
            }

            // console.log(opts)

            this.dt = new Flatpickr(document.getElementById(this.id), opts);
            // document.getElementById(this.id).flatpickr(opts)

            // this.cd.markForCheck()
            // this.inited = true;
        });
    }

    onChange(value: any) {
        // console.info('DatetimePickerComponent value onChange', this)
        // this.cd.detectChanges();
        // this.init()
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

            if (propName == 'options' && prev != '{}') {
                // console.log('DatetimePickerComponent ngOnChanges')
                // this.cd.detectChanges();
                // this.init();
                this.dt.destroy();
                this.init();
                // this.dt.set('minDate', chng.currentValue.min)
                // this.dt.set('maxDate', chng.currentValue.max)
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }
        }
    }

    ngOnDestroy() {
        // console.log('dispose ui flatpickr')
        // if (this.dt)
        //     this.dt.destroy()
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