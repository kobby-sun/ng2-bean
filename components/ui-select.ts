
// Import the core angular services.
import { Component, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";
import { ContentChild } from "@angular/core";
import { TemplateRef } from "@angular/core";
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { BaseUIComponent } from "./ui-component"

import * as util from "../util";

declare var $: any;
declare var _: any;

// Import the application components and services.
// import { createTemplateRenderer } from "./template-renderer.directive";

const UI_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UISelectComponent),
    multi: true
};

@Component({
    selector: "ui-select",
    // changeDetection: ChangeDetectionStrategy.OnPush,
    // inputs: ["items", "value", "placeholder", "valueUpdated", "multiple"],

    providers: [UI_SELECT_VALUE_ACCESSOR],

    // Here, we are querying for the <template> tags in the content.
    // queries: {
    //     itemTemplateRef: new ContentChild("itemRenderer")
    // },

    // We're going to provide a dynamically-generated directive that exposes custom 
    // inputs that we want to pass to our item renderer. In this case, we want to 
    // expose "context.item" and "context.index". This will return a directive with
    // the selector, "template[render]", which are using in our view.
    // directives: [
    //     createTemplateRenderer("item", "index")
    // ],
    template:
    `
        <div #uiSelect *ngIf="!allowAdditions" [class.error]="isErr" [class.disabled]="disabled" [class.multiple]="multiple" class="ui dropdown fluid selection">
            <input type="hidden" [name]="'select' + id" [value]="value">
            <div class="default text">{{placeholder}}</div>
            <i class="dropdown icon"></i>
            <div class="menu" *ngIf="useTemplate">
                <template *ngFor="let item of items; let index = index ;"
                    [ngOutletContext]="{
                        item: item,
                        index: index
                    }" 
                    [ngTemplateOutlet]="template">
                </template>
            </div>
            <div class="menu" *ngIf="!useTemplate">
                <div *ngFor="let a of items" class="item" [attr.data-value]="a.value">{{a.label}}</div>                
            </div>
        </div>

        <div #uiSelect *ngIf="allowAdditions" class="ui fluid multiple search selection dropdown">
            <input type="hidden" [name]="'select' + id" [value]="value">
            <i class="dropdown icon"></i>
            <div class="default text">{{placeholder}}</div>
            <div class="menu">
            </div>
        </div>
	`
})
export class UISelectComponent extends BaseUIComponent {

    @Output() valueUpdated = new EventEmitter();

    // @Input() value: string;

    @Input() placeholder: string;

    @Input() useTemplate: boolean = true;

    // @Input() multiple: boolean;

    @Input() settings: any;

    @Input() isErr: boolean;

    @Input() disabled: boolean;

    @ViewChild('uiSelect') uiSelect: any;

    @Input() items: any[] = [];

    // public itemTemplateRef: TemplateRef<any> = null;

    @ContentChild(TemplateRef) template: TemplateRef<any>;

    id: string = util.uuid()

    inited: boolean = false;

    get multiple(): boolean {
        return this.settings && this.settings.multiple
    }
    get allowAdditions(): boolean {
        return this.settings && this.settings.allowAdditions
    }

    constructor(private cd: ChangeDetectorRef) {
        super()
    }

    public init() {
        // this.inited = false;
        setTimeout(() => {
            // let ele = '#' + this.id
            let ele = this.uiSelect.nativeElement

            let opts = {
                onChange: (value) => {
                    // console.log('UISelect onChange', value)
                    let val = this.safeSplit(value)
                    if (util.stringify(this.value) == util.stringify(val)) return;

                    this.value = this.parseValue(value)

                    let label = this.multiple || this.allowAdditions ? null : $(this.uiSelect.nativeElement).dropdown('get item', value).text()

                    // console.info(this.value)
                    this.valueUpdated.emit({ value: this.value, label: label });
                }
            }

            if (this.settings) {
                opts = Object.assign(opts, this.settings)
            }

            $(ele).dropdown(opts);

            // this.cd.markForCheck()
            // this.inited = true;
        });
    }

    safeSplit(value){
        return value == null || value == '' ? [] : value.split(',')
    }

    parseValue(value) {
        return this.multiple || this.allowAdditions ?
             this.safeSplit(value)//_.sortBy(val) //multi mode
            : value //single mode
    }

    onChange(value: any) {
        // console.info('UISelectComponent value onChange', this)
        // this.cd.detectChanges();
        if (this.uiSelect != null) {
            if (this.allowAdditions)
                setTimeout(() => $(this.uiSelect.nativeElement).dropdown('set exactly', this.safeSplit(this.value)));
            else
                setTimeout(() => $(this.uiSelect.nativeElement).dropdown('set selected', this.parseValue(this.value)));
        }
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        // console.log('UISelectComponent ngAfterViewInit');
        // this.cd.detectChanges();
        this.init();
        // $(this.uiSelect.nativeElement).dropdown('save defaults');
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                // console.log('UISelectComponent ngOnChanges')
                // this.cd.detectChanges();
                this.init();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy() {
        // console.log('dispose ui select')
        // $(this.uiSelect.nativeElement).dropdown('refresh menu')
        $(this.uiSelect.nativeElement).dropdown('destroy')
    }
}