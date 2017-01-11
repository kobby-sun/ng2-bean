
// Import the core angular services.
import { Component, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";
import { ContentChild } from "@angular/core";
import { TemplateRef } from "@angular/core";
import {ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';

import { forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {BaseUIComponent} from "./ui-component"

import * as util from "../util";

declare var $: any;

// Import the application components and services.
import { createTemplateRenderer } from "../directives/template-renderer.directive";

const UI_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UISelectComponent),
    multi: true
};    

@Component({
    selector: "ui-select",
    changeDetection: ChangeDetectionStrategy.OnPush,

    providers: [UI_SELECT_VALUE_ACCESSOR],

    template:
    `
    <span [hidden]="inited">loading...</span>
    <select [id]="id" [hidden]="!inited" class="form-control" [class.select2-multiple]="multiple" [class.select2-single]="!multiple" [attr.multiple]="multiple">
        <option [value]="o.value" *ngFor="let o of items; let i = index">{{o.label}}</option>
    </select>
	`
})
export class UISelectComponent extends BaseUIComponent {

    @Output() valueUpdated = new EventEmitter();

    // @Input() value: string;

    @Input() placeholder: string;

    @Input() multiple: boolean;

    @Input() isErr: boolean;

    disposed: boolean;

    @Input() templateResult: any;

    @Input() disabled: boolean;

    @Input() allowClear: boolean = true;

    // @ViewChild('uiSelect') uiSelect: any;

    @Input() items: any[] = [];

    id: string = util.uuid()

    inited: boolean = false;

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    public init() {
        let self = this;
        this.inited = false;
        setTimeout(() => {
            let ele = '#' + this.id
            // let ele = this.uiSelect.nativeElement

            let opts = {
                theme: "bootstrap",
                placeholder: this.placeholder,
                allowClear: this.allowClear,
                minimumResultsForSearch: Infinity
            }

            //custom select option template
            if (this.templateResult)
                opts = Object.assign(opts, { templateResult: this.templateResult })

            $(ele).select2(opts);

            console.info('ui-select2', this.value)

            if (this.value) $(ele).val(this.value)

            $(ele).on("select2:select", function (e) {
                // console.log("select2:select", e);
                // let val = e.params.data.id
                // self.valueUpdated.emit(self.value);
            });

            $(ele).on("change", function (e) {
                let val = $(this).val()
                if (util.stringify(self.value) == util.stringify(val)) return;
                self.value = val;
                self.valueUpdated.emit(val);
            });

            this.cd.markForCheck()
            this.inited = true;
        });
    }

    onChange(value: any) {
        console.log(this)
        if (this.disposed) {
            $('#' + this.id).select2("destroy")
            return;
        }
        
        console.log('UISelectComponent value onChange', value)
        this.cd.detectChanges();
        this.init()
    }

    ngOnInit() {
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        console.log('UISelectComponent ngAfterViewInit');
        this.cd.detectChanges();
        this.init();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                console.log('UISelectComponent ngOnChanges')
                this.cd.detectChanges();
                this.init();
                console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy() {
        //destroy dom and set disposed flag, @@Don't know why Angular didn't dispose it ...
        $('#' + this.id).select2("destroy")
        this.disposed = true;
    }
}