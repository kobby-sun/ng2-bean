import { ChangeDetectorRef, SimpleChange, Component, ViewChild, ElementRef, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Http } from '@angular/http';
import { UIForm, UIFormControl, UIFormControlEvent, FORM_CONTROL_TYPE } from './ui-form'
import { Collection, Entity } from "../model";
import * as validators from '../ui-validators'
import * as util from '../util'

declare var $;
declare var _;

@Component({
    selector: 'ui-address',
    // templateUrl: './ui-address.tpl.html',
    template: `
<div class="two fields">
    <div class="field">
        <label>Line 1</label>
        <ui-fc (onChange)="searchAddr($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.addr1"></ui-fc>
    </div>

    <div class="field">
        <label>Line 2</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.addr2"></ui-fc>
    </div>
</div>

<div class="three fields">
    <div class="eight wide field">
        <label>City</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.city"></ui-fc>
    </div>
    <div class="four wide field">
        <label>State</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.state"></ui-fc>
    </div>
    <div class="four wide field">
        <label>Postcode</label>
        <ui-fc (onChange)="change($event)" [formGroup]="formGroup.controls[form.name + '_' + field.name]" [form]="form" [(model)]="model" [field]="fields.postcode"></ui-fc>
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

    au_states = [
        { value: 'ACT', label: 'Australian Capital Territory' },
        { value: 'NSW', label: 'New South Wales' },
        { value: 'NT', label: 'Northern Territory' },
        { value: 'QLD', label: 'Queensland' },
        { value: 'SA', label: 'South Australia' },
        { value: 'TAS', label: 'Tasmania' },
        { value: 'VIC', label: 'Victoria' },
        { value: 'WA', label: 'Western Australia' }
    ]

    fields: any = {}

    ngOnInit() {
        this.fields = {
            addr1: {
                type: FORM_CONTROL_TYPE.SEARCH, name: 'Address1', validators: [
                    ...this.field.validators
                ],
                settings: { ds: null },
                nolbl: true
            },
            addr2: {
                type: FORM_CONTROL_TYPE.TEXT, name: 'Address2', validators: [
                    // Validators.required
                ],
                nolbl: true
            },
            city: {
                type: FORM_CONTROL_TYPE.TEXT, name: 'City', validators: [
                    ...this.field.validators
                ],
                nolbl: true
            },
            state: {
                type: FORM_CONTROL_TYPE.SELECT, name: 'State', validators: [
                    ...this.field.validators
                ],
                opts: this.au_states,
                nolbl: true
            },
            postcode: {
                type: FORM_CONTROL_TYPE.TEXT, name: 'Postcode', validators: [
                    ...this.field.validators,
                    validators.postcodeValidator
                ],
                nolbl: true
            }
        }

        this.init();
        // console.log('ui-address', this)
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
        let group: any = {};
        Object.keys(this.fields).forEach(k => {
            let field = this.fields[k]
            group[this.form.name + '_' + field.name] = new FormControl(this.model[field.name], field.validators)
            if (this.model[field.name] != null)
                group[this.form.name + '_' + field.name].markAsDirty()
        })
        this.formGroup.controls[this.form.name + '_' + this.field.name] = new FormGroup(group);
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

        this.model['Address1'] = _addr.addr1;
        this.model['Address2'] = _addr.addr2;
        this.model['City'] = _addr.suburb;
        this.model['State'] = _addr.state;
        this.model['Postcode'] = _addr.postcode;
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
        if (this.validateSearch(this.model['Address1']) && this.lastSearch != this.model['Address1']) {
            this.lastSearch = this.model['Address1']
            // this.energyShareService.searchAddress(this.model['Address1']).subscribe(
            //     results => {
            //         // console.log(results)
            //         if (results && results.length > 0)
            //             this.fields.addr1.settings = { ds: results };
            //     }
            // )
            this.query(results => {
                // console.log(results)
                if (results && results.length > 0)
                    this.fields.addr1.settings = { ds: results };
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