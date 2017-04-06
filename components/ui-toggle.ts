import { Component, ViewChild, ElementRef, Input, Output, SimpleChange, EventEmitter  } from '@angular/core';

import {forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';

import {BaseUIComponent} from "./ui-component"
import * as util from '../util'


declare var $;

const UI_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true
};    

@Component({
    selector: 'ui-toggle',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UI_TOGGLE_VALUE_ACCESSOR],
    template: `
            <div class="checkbox" [class.disabled]="disabled" style="margin-top: 0px; margin-bottom: 0px">
                <label>
                    <input #toggle type="checkbox" [disabled]="disabled" [checked]="value">
                    <span *ngIf="label && label != ''" style="padding-left: 5px" [style.font-size]="labelSize" [style.font-weight]="labelBold ? 'bold' : 'normal'">{{label}}</span>
                </label>
            </div>
    `
})
export class ToggleComponent extends BaseUIComponent {
    @Input() settings: any;
    
    // @Input() value: boolean = false;
    @Input() disabled: boolean = false;
    @Input() label: string;
    @Input() size: string = 'normal';
    @Input() on: string = 'On';
    @Input() off: string = 'Off';
    @Input() onStyle: string = 'primary';
    @Input() offStyle: string = 'default';
    @Input() labelSize: string = '16px';
    @Input() labelBold: boolean = true;
    @Output() valueUpdated = new EventEmitter();

    @ViewChild('toggle') toggle: ElementRef;

    id: string = util.uuid()

    lastValue: any = {};

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    init() {
        let self = this;

        setTimeout(() => {

            // let ele = $(this.element.nativeElement).find('input[type=checkbox]')
            let ele = this.toggle.nativeElement

            $(ele).bootstrapToggle({
                size: this.size,
                on: this.on,
                off: this.off,
                onstyle: this.onStyle,
                offstyle: this.offStyle
            });

            $(ele).bootstrapToggle(this.disabled ? 'disable' : 'enable')

            $(ele).bootstrapToggle(this.value ? 'on' : 'off')


            $(ele).change(function () {
                let val = $(this).prop('checked')
                if (self.value != val) {
                    // console.log('ToggleComponent checked changed to ' + val);
                    self.value = val;
                    self.valueUpdated.emit(val)
                }
            })

            // this.cd.markForCheck()
        })

        // setTimeout(() => {
        //     let ele = this.toggle.nativeElement

        //     console.log('bootstrap switch disabled: ', this.disabled)

        //     $(ele).bootstrapSwitch({
        //         size: this.size,
        //         readonly: this.disabled,
        //         state: this.value,
        //         onColor: this.onStyle,
        //         offColor: this.offStyle,
        //         onText: this.on,
        //         offText: this.off,
        //         labelWidth: 1,
        //         onSwitchChange: function (event, state) {
        //             self.value = state;
        //             self.valueUpdated.emit(state)
        //         }
        //     });
        // })
    }

    onChange(value: any){
        // console.log('ToggleComponent VALUE ON CHANGE', this)
        // this.cd.detectChanges();
        this.init()
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
        $(this.toggle.nativeElement).bootstrapToggle("destroy")
    }
}