import {OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import * as util from '../util'
const noop = () => { };

export abstract class BaseUIComponent implements ControlValueAccessor, OnDestroy {

    //The internal data model
    private _value: any = null;

    //Placeholders for the callbacks
    private _onTouchedCallback: () => void = noop;

    private _onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any { return this._value; };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
        }
    }

    //Set touched on blur
    onTouched() {
        this._onTouchedCallback();
    }

    protected onChange(value: any) {
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (util.stringify(value) != util.stringify(this._value)) {
            // console.debug(this.constructor.name + ' old Value', this._value);
            this._value = value;
            // console.debug(this.constructor.name + ' writeValue', value);
            this.onChange(value)
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    abstract ngOnDestroy()
}