import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment from 'moment'

// UI Validators
@Directive({
    selector: '[validateArray][ngModel],[validateArray][formControl]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => UIArrayValidator), multi: true }
    ]
})
export class UIArrayValidator {
    validate(c: FormControl) {
        return c.value == null || c.value.length == 0 ? {
            required: {
                valid: false
            }
        } : null
    }
}

// SINGLE FIELD VALIDATORS
export function arrayValidator(c: FormControl) {
    return c.value == null || c.value.length == 0 ? {
        required: {
            valid: false
        }
    } : null
}

export function phoneValidator(control: FormControl): { [key: string]: any } {
    var phoneRegexp = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/
    if (control.value && !phoneRegexp.test(control.value)) {
        return { invalidPhone: true, errorMsg: 'Invalid Phone Number' };
    }
}

export function postcodeValidator(control: FormControl): { [key: string]: any } {
    var postcodeRegexp = /^[0-9]{4}$/
    if (control.value && !postcodeRegexp.test(control.value)) {
        return { invalidPostcode: true, errorMsg: 'Invalid Postcode' };
    }
}

export function ipValidator(control: FormControl): { [key: string]: any } {
    var ipRegexp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    if (control.value && !ipRegexp.test(control.value)) {
        return { invalidIP: true, errorMsg: 'Invalid IP Address' };
    }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true, errorMsg: 'Invalid Email address' };
    }
}

export function latlngValidator(control: FormControl): { [key: string]: any } {
    var latlngRegexp = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;
    if (control.value && !latlngRegexp.test(control.value)) {
        return { invalidLatLng: true, errorMsg: 'Invalid geographic coordinate' };
    }
}

export function dateValidator(control: FormControl): { [key: string]: any } {
    if (control.value && !moment(control.value).isValid()) {
        return { invalidStartDate: true, errorMsg: 'Invalid Date format' };
    }
}

export function startDateValidator(control: FormControl): { [key: string]: any } {
    if (control.value && (!moment(control.value).isValid() || moment(control.value).diff(moment(), 'days') < 0)) {
        return { invalidStartDate: true, errorMsg: 'Start date cannot be less than current date' };
    }
}

export function endDateValidator(control: AbstractControl, startDate: any): { [key: string]: any } {
    let fg = <FormGroup>control.parent;
    if (!fg) return;
    let sdate = fg.controls[startDate]
    if (control.value && (!moment(control.value).isValid() || moment(control.value).diff(moment(sdate.value), 'days') < 0)) {
        return { invalidEndDate: true, errorMsg: 'End date cannot be less than start date' };
    }
}

//CONTROL GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true,
                errorMsg: 'Password does not match the confirm password'
            };
        }
    }
}

//UI Validator Custom error message wrapper
export function errorMsgWrapper(fn: ValidatorFn, errorMsg: string) {
    return (control: FormControl) => {
        let res = fn(control);
        if (res != null) {
            res['errorMsg'] = errorMsg
        }
        return res
    }
}

export const UIValidators = [
    UIArrayValidator
]