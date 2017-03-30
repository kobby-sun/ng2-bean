import { ApplicationRef, Component, ViewChild, ViewChildren, QueryList, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as Fuse from 'fuse.js'

declare var $: any;

@Component({
    selector: 'fuse-search',
    template: `
    <div class="ui icon input">
    <i class="search icon"></i>
     <input type="text" placeholder="Search..." style="padding: 2px;" (ngModelChange)="textChange($event)" [ngModel]="keywords">
  <!--<div type="submit" class="large ui button" (click)="filterResult($event)">Search</div>-->
  </div>
  `,
})
export class UIFuseSearchComponent {

    @Input() keys: any;

    @Input() ds: any;
    @Output() onFilterData: EventEmitter<any> = new EventEmitter<any>()

    keywords: string;

    filterResult() {
        // console.log('rst', this.ds)
        let options = {
            keys: this.keys//['name', 'address.line1', 'address.line2', 'address.suburb', 'address.state', 'address.postCode'],
            // id: 'id'
        }
        let fuse = new Fuse(this.ds, options)

        let result1 = this.keywords && this.keywords != '' ?
            fuse.search(this.keywords || '') : this.ds

        // console.log('search rst', this.keywords, result1)

        this.onFilterData.emit(result1)
    }

    textChange(evt) {
        this.keywords = evt;
        setTimeout(() => this.filterResult());
    }

    ngOnInit() {
        this.filterResult()
    }

    ngOnChanges(changes: any) {
        this.filterResult()
    }

}
