import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-datepicker',
    template: `
      <label>{{label}}</label>
      <input [(ngModel)]="dateModel" class="form-control"     (focus)="showPopup()" />
      <datepicker class="ui-datepicker" *ngIf="showDatepicker" [(ngModel)]="dateModel" showWeeks="true" (ngModelChange)="hidePopup($event)" ></datepicker>
  `,
    styles: [`
    .ui-datepicker {
      position: absolute;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #ddd;
      height: 251px;
    }
  `],
})
export class UIDatepickerComponent {
    @Input()
    dateModel: Date;
    @Input()
    label: string;
    @Output()
    dateModelChange: EventEmitter<string> = new EventEmitter();
    private showDatepicker: boolean = false;

    showPopup() {
        this.showDatepicker = true;
    }

    hidePopup(event) {
        this.showDatepicker = false;
        this.dateModel = event;
        this.dateModelChange.emit(event)
    }
}