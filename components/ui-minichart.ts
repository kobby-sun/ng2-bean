import { Component, SimpleChange, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as util from '../util'

declare var $;
declare var _;

@Component({
    selector: 'ui-minichart',
    template: `
        <span [hidden]="!ds || ds == '' || !inited" #chart class="chart-line">{{feed}}</span>
    `
})
export class UIMiniChartComponent {
    // @Input() ds: string;
    @Input() append: boolean = true;
    @Input() width: number = 80;
    @Input() border: string = '#6D6E71';
    @Input() fill: string = '#32CD32';
    @Output() valueUpdated = new EventEmitter();

    id: string = util.uuid()
    inited: boolean = false;

    @ViewChild('chart') chart: ElementRef;

    @Input()
    set ds(value: string) {
        this._ds = value;
    }

    private _ds: string = '';

    get feed() {
        if (!this._ds || this._ds == '') return ''
        return this._ds
    }

    init() {
        if (this.feed == '') return;
        
        setTimeout(() => {
            // this.inited = false;

            let ele = this.chart.nativeElement

            // console.log(this.feed)

            $(ele).peity("line",
                { width: this.width, stroke: this.border, fill: this.fill }
            ).text(this.feed).change()


            // this.cd.markForCheck()
            this.inited = true;
        });
    }

    ngOnInit() {
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        // console.log('DatetimePickerComponent ngAfterViewInit');
        // this.cd.detectChanges();
        this.init();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        for (let propName in changes) {
            let chng = changes[propName];
            let cur = util.stringify(chng.currentValue);
            let prev = util.stringify(chng.previousValue);
            console.debug(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

            if (prev != '{}') {
                // console.log('DatetimePickerComponent ngOnChanges')
                // this.cd.detectChanges();
                this.init();
                // console.info(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
            }
        }
    }

    ngOnDestroy() {
        // console.log('dispose ui minichart')

    }
}
