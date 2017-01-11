import { Component, Directive, ElementRef, Renderer } from '@angular/core';

declare var $: any;

@Directive({
    selector: '[table-stackable]'
    
})
export class TableStackable {

    constructor(private element: ElementRef, renderer: Renderer) {

    }

    ngOnInit() {

        // this.element.nativeElement.parentNode.addEventListener('DOMSubtreeModified', () => {
        //     console.log('TableStackable DOMSubtreeModified')
        // }, false);
        // this.element.nativeElement.parentNode.addEventListener('DOMNodeInserted', () => {
        //     console.log('TableStackable DOMNodeInserted')
        // }, false);
        // this.element.nativeElement.parentNode.addEventListener('DOMCharacterDataModified', () => {
        //     console.log('TableStackable DOMCharacterDataModified')
        // }, false);


        let resize = () => {
            let winWidth = $(window).width();

            console.log('window width', winWidth)
            console.log('TableStackable width', $(this.element.nativeElement).width())
            console.log('TableStackable accordion width', $(this.element.nativeElement).closest('.accordion').width())
            // console.log('TableStackable table css', $(this.element.nativeElement).attr('class'))
        }

        $(window).on('resize', resize);
        $(window).ready(resize);
    }

    ngAfterViewInit() {

    }

    ngOnChanges() {
        // console.info('ngOnChanges');
    }
}
