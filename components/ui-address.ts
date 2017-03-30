import { ChangeDetectorRef, SimpleChange, Component, ViewChild, ElementRef, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Http } from '@angular/http';
import { UIForm, UIFormControl, UIFormControlEvent, FORM_CONTROL_TYPE } from './ui-form'
import { Collection, Entity } from "../model";
import * as validators from '../ui-validators'
import * as util from '../util'
import * as _ from 'lodash'

declare var $;

@Component({
    selector: 'ui-address',
    // templateUrl: './ui-address.tpl.html',
    template: `
<div class="two fields">
    <div class="field">
        <label>Line 1</label>
        <ui-fc (onChange)="searchAddr($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.line1"></ui-fc>
    </div>

    <div class="field">
        <label>Line 2</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.line2"></ui-fc>
    </div>
</div>

<div class="three fields">
    <div class="eight wide field">
        <label>Suburb</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.suburb"></ui-fc>
    </div>
    <div class="four wide field">
        <label>State</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.state"></ui-fc>
    </div>
    <div class="four wide field">
        <label>Postcode</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.postCode"></ui-fc>
    </div>
</div>
    `,
    styles: [`
fieldset.legend-border {
    /*border: 1px groove #ddd !important;*/
    padding: 0 1.4em 1.4em 1.4em !important;
    margin: 0 0 1.5em 0 !important;
    -webkit-box-shadow:  0px 0px 0px 0px #000;
            box-shadow:  0px 0px 0px 0px #000;
}

legend.legend-border {
    width:inherit; /* Or auto */
    padding:0 10px; /* To give a bit of padding on the left and right */
    border-bottom:none;
}
    `]
})
export class AddressComponent {
    @Input() model: Entity = new Entity();
    @Input() field: UIFormControl;
    @Input() form: UIForm;
    @Input() formGroup: FormGroup;
    @Output() onChange: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            // console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                this.init()
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }
        }
    }

    init() {
        // let group: any = {};
        // Object.keys(this.field.fields).forEach(k => {
        //     let field = this.field.fields[k]
        //     group[this.form.name + '_' + field.name] = new FormControl(this.model[field.name], field.validators)
        //     if (this.model[field.name] != null)
        //         group[this.form.name + '_' + field.name].markAsDirty()
        // })
        // this.formGroup.controls[this.form.name + '_' + this.field.name] = new FormGroup(group);
    }

    f(name) {
        return _.find<any>(this.field.fields, fd => fd.name == `${this.field.name}.${name}`)
    }

    constructor(protected http: Http) {

    }

    validateSearch(search: string): boolean {
        if (!search) return false;
        let match = /(^[0-9A-Za-z-\/ ]+[ ]|^)+(([A-Za-z]){3})$/.exec(search)
        return match != null;
    }

    lastSearch: string;

    query(cb) {
        cb([])
    }

    selectAddr(addr) {
        let _addr = this.parseAddr(addr)

        this.model[`${this.field.name}.line1`] = _addr.addr1;
        this.model[`${this.field.name}.line2`] = _addr.addr2;
        this.model[`${this.field.name}.suburb`] = _addr.suburb;
        this.model[`${this.field.name}.state`] = _addr.state;
        this.model[`${this.field.name}.postCode`] = _addr.postcode;
    }

    parseAddr(addr) {
        let parts = addr.split(',')
        let addr1 = parts[0]
        let addr2 = ''
        let part2s = parts[1].trim().split(' ')

        let state = part2s[part2s.length - 2]
        let postcode = part2s[part2s.length - 1]
        if (postcode == 'NA')
            postcode = '0000'
        let suburb = parts[1].trim().replace(' ' + state + ' ' + postcode, '')
        if (part2s.length == 2)
            suburb = addr1

        return {
            addr1,
            addr2,
            suburb,
            state,
            postcode
        }
    }

    searchAddr(evt) {
        let line1 = this.model[`${this.field.name}.line1`]
        if (this.validateSearch(line1) && this.lastSearch != line1) {
            this.lastSearch = line1
            // this.energyShareService.searchAddress(this.model['line1']).subscribe(
            //     results => {
            //         // console.log(results)
            //         if (results && results.length > 0)
            //             this.fields.addr1.settings = { ds: results };
            //     }
            // )
            this.query(results => {
                // console.log(results)
                if (results && results.length > 0)
                    this.f('line1').settings = { ds: results };
            })
        }

        if (evt.event.type == 'onselect') {
            this.selectAddr(evt.event.title)
        }

        this.onChange.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }

    change(evt) {
        this.onChange.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }
}