import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'ui-loader',
    template: `
    <!-- Facebook Loader -->
    <div #element [hidden]="hidden">
        <div class="loader">
            <div class="loader-bar"></div>
            <div class="loader-bar"></div>
            <div class="loader-bar"></div>
        </div>
    </div>
    `
})
export class UILoaderComponent {
    @Input() hidden: boolean
    @ViewChild('element') element: ElementRef;
}