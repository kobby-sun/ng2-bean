import { Component, ViewChild, ElementRef, QueryList, ContentChildren, TemplateRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';

import * as util from '../util'

declare var $: any;
declare var _: any;

export enum TabStyle {
    top_attached_tabular,
    pointing_secondary,
    secondary
}

export interface Tab {
    uid: string;
    title: string;
    edit: boolean;
    add: boolean;
    changed: boolean;
    removable: boolean;
    formValue: any;
    formModel: any;
}

@Component({
    selector: 'ui-tab',
    template: `
    <div [class.active]="tabIndex == settings.uid" class="ui tab" [attr.data-tab]="settings.uid">
        <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
    @Input('tabIndex') tabIndex: string;
    @Input() settings: Tab;

    ngAfterViewInit() {
        // console.log(this.tabIndex)
    }
}


@Component({
    selector: 'ui-tabs',
    template: `
<div [class]="'ui stackable ' + tabStyleCss + ' menu ' + id">
    <a *ngFor="let t of tabs" [class.active]="tabIndex == t.settings.uid" class="red item" [attr.data-tab]="t.settings.uid">{{t.settings.title}} <i *ngIf="t.settings.removable" style="padding-left: 10px;" class="small close icon" (click)="rmTab(t.settings.uid, $event)"></i></a>
</div>

<br/>

<ng-content></ng-content>
    `
})
export class TabsComponent {

    @Output() tabSelected = new EventEmitter();
    @Output() onRemoveTab = new EventEmitter();

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    id: string = util.uuid()

    @Input() tabStyle = TabStyle.pointing_secondary

    // tabs: Array<any> = []
    @Input() tabIndex: string;

    get tabStyleCss() {
        return TabStyle[this.tabStyle].replace('_', ' ')
    }

    init() {
        let self = this;

        // console.log('TabsComponent init', this.tabIndex)

        setTimeout(() => {
            $(document).ready(() => {
                $('.' + this.id + '.menu .item').tab({
                    history: false,
                    onVisible: (value) => {
                        // console.log('tab onVisible idx ' + value)
                        this.tabIndex = value;
                        this.tabSelected.emit(value)
                    }
                });
            });
        }, 100);
    }

    rmTab(uid, evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.onRemoveTab.emit(uid)
    }

    ngAfterViewInit() {
        // console.log('TabsComponent ngAfterViewInit');
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
                // console.log('TabsComponent ngOnChanges');
                // this.cd.detectChanges();
                this.init();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }

        }
    }

    ngOnDestroy() {
        $('.' + this.id + '.menu .item').tab('destroy');    
    }
}

export const TAB_DIRECTIVES: Array<any> = [
    TabsComponent,
    TabComponent
];

export default {
    directives: [
        TAB_DIRECTIVES
    ]
};