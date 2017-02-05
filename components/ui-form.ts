import { ViewChild, Component, ElementRef, Input, Output, ChangeDetectorRef, SimpleChange, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Collection, Entity } from "../model";
import * as util from '../util'
import * as validators from '../ui-validators'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var _;
declare var $;

export enum FORM_CONTROL_TYPE {
    LABEL = 1,
    TEXT,
    SELECT,
    MULTISELECT,
    DATE,
    DATETIME,
    TIME,
    TOGGLE,
    TEXTAREA,
    ADDRESS,
    ACCORDION,
    FIELDS,
    CHECKBOX,
    SEARCH
}

export interface UIForm {
    name: string,
    fields: Array<UIFormControl>;
}
export interface UIFormControl {
    id: string,
    type: FORM_CONTROL_TYPE,
    group: boolean,
    name: string,
    label: string,
    placeholder: string,
    validators: Array<ValidatorFn>,
    options: Array<any>,
    ds: Function,
    disabled: boolean,
    readonly: boolean,
    hidden: boolean,
    value: any,
    fields: any
}

export interface UIFormEvent {
    event: any;
    model: Entity;
}

export interface UIFormControlEvent {
    event: any;
    source: any;
    model: Entity;
}


@Component({
    selector: 'ui-fc',
    template: `
            <div *ngIf="!field.hidden" [formGroup]="formGroup" class="field">
                <label *ngIf="!field.nolbl">{{field.label}}</label>
                
                <div *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.TEXT" 
                      [class.error]="formGroup.controls[form.name + '_' + field.name] != null && !formGroup.controls[form.name + '_' + field.name].pristine && formGroup.controls[form.name + '_' + field.name].invalid"
                      class="ui right labeled input fluid"
                      [class.right]="!field.readonly" [class.labeled]="!field.readonly"
                      >
                    <input #uiComponent (ngModelChange)="textChange($event)"
                        [attr.readonly]="field.readonly" [attr.disabled]="field.disabled"
                        [formControlName]="form.name + '_' + field.name" type="text" 
                        [placeholder]="field.placeholder || ''" [ngModel]="model[field.name]">
                    <div *ngIf="!field.readonly" class="ui basic label"><i class="fa fa-pencil" aria-hidden="true"></i></div>
                </div>

                <ui-search #uiComponent [settings]="field.settings" *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.SEARCH" 
                        (valueUpdated)="change($event)"
                        [placeholder]="field.placeholder || ''" [(ngModel)]="model[field.name]" [formControlName]="form.name + '_' + field.name">
                </ui-search>

                <ui-checkbox #uiComponent [settings]="field.settings" *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.CHECKBOX" 
                        (valueUpdated)="change($event)"
                        [label]="field.placeholder" [(ngModel)]="model[field.name]" [formControlName]="form.name + '_' + field.name">
                </ui-checkbox>

                <ui-toggle #uiComponent (valueUpdated)="change($event)" *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.TOGGLE" [formControlName]="form.name + '_' + field.name"
                    [(ngModel)]="model[field.name]"></ui-toggle>

                <ui-select #uiComponent [settings]="field.settings" (valueUpdated)="change($event)" [isErr]="formGroup.controls[form.name + '_' + field.name] != null && !formGroup.controls[form.name + '_' + field.name].pristine && formGroup.controls[form.name + '_' + field.name].invalid" *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.SELECT" [formControlName]="form.name + '_' + field.name"
                        [placeholder]="field.placeholder || ''" [(ngModel)]="model[field.name]" [items]="field.opts">
                    <template let-a="item" let-index="index">
                        <div class="item" [attr.data-value]="a.value">{{a.label}}</div>
                    </template>
                </ui-select>
                
                <datetime-picker #uiComponent (valueUpdated)="change($event)" [isErr]="formGroup.controls[form.name + '_' + field.name] != null && !formGroup.controls[form.name + '_' + field.name].pristine && formGroup.controls[form.name + '_' + field.name].invalid" 
                    *ngIf="formGroup.controls[form.name + '_' + field.name] != null && (field.type == FORM_CONTROL_TYPE.DATE || field.type == FORM_CONTROL_TYPE.DATETIME || field.type == FORM_CONTROL_TYPE.TIME)" 
                    [options]='mergeOpts({"date": field.type != FORM_CONTROL_TYPE.TIME, "time": field.type != FORM_CONTROL_TYPE.DATE}, field.settings)' 
                    [formControlName]="form.name + '_' + field.name" 
                    [(ngModel)]="model[field.name]">
                </datetime-picker>

                <ui-address #uiComponent (onChange)="change($event)" [formGroup]="formGroup" [form]="form" 
                    *ngIf="formGroup.controls[form.name + '_' + field.name] != null && field.type == FORM_CONTROL_TYPE.ADDRESS" 
                    [(model)]="model[field.name]" [field]="field">
                </ui-address>

                <div *ngIf="field.type == FORM_CONTROL_TYPE.LABEL" class="ui label">
                    {{model.js[field.name]}}
                </div>
                
                <div class="ui pointing red basic label" *ngIf="!field.group && formGroup.controls[form.name + '_' + field.name] != null && !formGroup.controls[form.name + '_' + field.name].pristine && formGroup.controls[form.name + '_' + field.name].invalid">
                    {{formGroup.controls[form.name + '_' + field.name].errors.required ? 'Required' : formGroup.controls[form.name + '_' + field.name].errors.errorMsg}}
                </div>
            </div>
    `
})
export class UIFormControlComponent {
    @Input() model: Entity;
    @Input() field: UIFormControl;
    @Input() form: UIForm;
    @Input() formGroup: FormGroup;
    @Output() onInit: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();
    @Output() onChange: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();
    @Output() onSelect: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();

    FORM_CONTROL_TYPE = FORM_CONTROL_TYPE

    @ViewChild('uiComponent') uiComponent: any;

    ngOnInit() {
        this.onInit.emit({
            event: null,
            source: this,
            model: this.model
        })
    }

    // ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    //     for (let propName in changes) {
    //         let chng = changes[propName];
    //         let cur = util.stringify(chng.currentValue);
    //         let prev = util.stringify(chng.previousValue);
    //         console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

    //     }
    // }

    textChange(evt) {
        this.model[this.field.name] = evt
        this.change(evt)
    }

    change(evt) {
        this.onChange.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }

    select(evt) {
        this.onSelect.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }

    mergeOpts(o1, o2){
        return Object.assign(o1, o2)
    }
}

@Component({
    selector: 'ui-field',
    template: `
        <ui-fc *ngIf="!isArray(field)" (onInit)="init($event)" (onChange)="change($event)" [formGroup]="formGroup" [form]="form" [(model)]="model" [field]="field"></ui-fc>
        <div *ngIf="isArray(field) && field.fields.length > 1" [class]="genFieldsClass(field.fields.length)">
            <div [class]="genFieldClass(fc)" *ngFor="let fc of field.fields">
                <ui-field (onInit)="init($event)" (onChange)="change($event)" [formGroup]="formGroup" [form]="form" [(model)]="model" [field]="fc"></ui-field>
            </div> 
        </div>
        <ui-field *ngIf="isArray(field) && field.fields.length == 1" (onInit)="init($event)" (onChange)="change($event)" [formGroup]="formGroup" [form]="form" [(model)]="model" [field]="field.fields[0]"></ui-field>
    `
})
export class UIFormFieldComponent {
    @Input() model: Entity;
    @Input() field: UIFormControl;
    @Input() form: UIForm;
    @Input() formGroup: FormGroup;
    @Output() onInit: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();
    @Output() onChange: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();

    FORM_CONTROL_TYPE = FORM_CONTROL_TYPE

    isArray(val) { return val.fields != null && val.fields.length > 0; }

    genFieldsClass(len) {
        return util.toWords(len) + 'fields';
    }

    genFieldClass(f) {
        if (f.wide) return util.toWords(f.wide) + 'wide field';
        return 'field';
    }

    init(evt: any) {
        this.onInit.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }

    change(evt: any) {
        this.onChange.emit({
            event: evt,
            source: this,
            model: this.model
        });
    }
}

export class UIFormHelper {
    static findField(form: UIForm, name: string) {
        let field = null;
        let find = fields => {
            fields.forEach(f => {
                if (f.name == name) {
                    field = f;
                    throw FormFieldFound;
                }
                if (f.fields && f.fields.length > 0) {
                    find(f.fields)
                }
            })
        }
        let FormFieldFound = {}
        try {
            find(form.fields)
        } catch (e) {
            if (e !== FormFieldFound) throw e;
        }
        return field
    }
}

@Component({
    selector: 'ui-form',
    template: `
     <div #uiForm [class.ui]="busy" [class.segment]="busy" [class.row]="!busy">
        <div *ngIf="busy" class="ui active inverted dimmer">
            <div class="ui huge loader"></div>
        </div>
        <div class="container-fluid">
            <form *ngIf="form" [name]="form.name" [formGroup]="model.fg" class="ui form">
                <div class="form-group ui-form-row" *ngFor="let f of form.fields">
                    <!--normal field-->
                    <ui-field *ngIf="!f.hidden && f.type != FORM_CONTROL_TYPE.ACCORDION" [formGroup]="model.fg" 
                              (onInit)="fc_init($event)" (onChange)="fc_change($event)" [form]="form" [(model)]="model" [field]="f"></ui-field>
                    <!--accordion field-->
                    <div *ngIf="!f.hidden && f.type == FORM_CONTROL_TYPE.ACCORDION" ui-accordion class="ui styled fluid accordion">
                        <div class="active title">
                            <i class="dropdown icon"></i> {{f.label}}
                        </div>
                        <div class="active content">
                            <div class="ui form">
                                <ui-field (onInit)="fc_init($event)" (onChange)="fc_change($event)" [formGroup]="model.fg" [form]="form" [(model)]="model" [field]="f"></ui-field>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div class="form-group row">
                    <div class="offset-sm-2 col-sm-10">
                        <button [disabled]="!(model.fg && model.fg.valid)" (click)="submit($event)" type="submit" class="ui primary button ui-form-submit">
                        Save
                        </button>
                        <button class="ui button ui-form-discard" (click)="close($event)">
                        Discard
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    `
})
export class UIFormComponent {
    @Input() form: UIForm;
    @Input() value: any;
    @Output() onSubmit: EventEmitter<UIFormEvent> = new EventEmitter<UIFormEvent>();
    @Output() onFormChange: EventEmitter<UIFormEvent> = new EventEmitter<UIFormEvent>();
    @Output() onControlInit: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();
    @Output() onControlChange: EventEmitter<UIFormControlEvent> = new EventEmitter<UIFormControlEvent>();
    @Output() onClose: EventEmitter<UIFormEvent> = new EventEmitter<UIFormEvent>();

    model: Entity = new Entity();

    FORM_CONTROL_TYPE = FORM_CONTROL_TYPE

    busy: boolean = false;

    isArray(val) { return val.fields != null && val.fields.length > 0; }

    close(evt: any) {
        this.onClose.emit({
            event: evt,
            model: this.model
        });
    }

    submit(evt: any) {
        this.busy = true;
        this.onSubmit.emit({
            event: evt,
            model: this.model
        });
        setTimeout(() => {
            this.busy = false;
        }, 1500);
    }

    fc_init(evt: any) {
        this.onControlInit.emit(evt);
        this.initForm()
    }

    fc_change(evt: any) {
        this.onControlChange.emit(evt);
        this.initForm()
    }

    _initFields(f: UIFormControl, fields: any) {
        if (this.isArray(f)) {
            _(f.fields).forEach(o => {
                this._initFields(o, fields)
            });
        } else {
            fields[f.name] = f.value
        }
    }

    init() {
        if (!this.form) return;

        let fields = { _id: util.uuid() }
        this.form.fields.forEach(o => {
            this._initFields(o, fields)
        })

        Entity.genProps(fields)

        //assign init values
        if (this.value)
            fields = _.assignIn(fields, this.value);

        this.model = new Entity(fields)
        // console.log('this.model', this.model)
        this.initForm()
    }

    _initFormGroup(f: UIFormControl, group: any) {
        if (this.isArray(f)) {
            _(f.fields).forEach(o => {
                this._initFormGroup(o, group)
            });
        } else {
            if (f.group) {
                group[this.form.name + '_' + f.name] = new FormGroup({})
            } else if (!f.hidden) {
                group[this.form.name + '_' + f.name] = new FormControl(this.model[f.name], f.validators)
                if (this.model[f.name] != null)
                    group[this.form.name + '_' + f.name].markAsDirty()
            }
        }
    }

    initForm() {
        let group: any = {};

        this.form.fields.forEach(o => {
            this._initFormGroup(o, group)
        })

        this.model.fg = new FormGroup(group);

        const formValueChanges$ = this.model.fg.valueChanges;
        formValueChanges$.subscribe(x => {
            // console.log('ui-form changed', this.model)
            this.onFormChange.emit({
                event: null,
                model: this.model
            });
        });
    }

    ngOnInit() {
        this.init()
    }

    @ViewChild('uiForm') uiForm: ElementRef;

    ngAfterViewInit() {
        $(document).ready(() => {
            $(this.uiForm.nativeElement).keydown(event => {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });
        });
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

    ngOnDestroy() {

    }

}
