import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-wizard',
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
    .ui-wizard__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
  `],
    template: `
    <ng-content></ng-content>
    <div
      class="ui-wizard__footer">
      <button
        [style.visibility]="isOnFirstStep() ? 'hidden' : 'visible'"
        (click)="stepChange.emit(step - 1)">
        Previous
      </button>
      {{step}} / {{steps}}
      <button
        *ngIf="!isOnFinalStep()"
        (click)="stepChange.emit(step + 1)">
        Next
      </button>
      <button
        *ngIf="isOnFinalStep()"
        (click)="finish.emit(step + 1)">
        {{finishText}}
      </button>
    </div>
  `,
})
export class UIWizard {
    @Input() finishText = 'Finish';
    @Input() step = 1;
    @Output() finish = new EventEmitter();
    @Output() stepChange = new EventEmitter();
    private steps = 0;
    private isOnFinalStep = () => this.step === this.steps;
    private isOnFirstStep = () => this.step === 1;

    public addStep() {
        const newSteps = this.steps + 1;

        this.steps = newSteps;

        return newSteps;
    }
}


@Component({
    selector: 'ui-wizard-step',
    host: {
        '[style.display]': 'isCurrent ? "flex" : "none"',
    },
    template: `
    <ng-content></ng-content>
  `,
})
export class UIWizardStep {
    private isCurrent;
    private step;

    constructor(
        private parent: UIWizard
    ) { }

    ngOnInit() {
        this.step = this.parent.addStep();

        this.isCurrent = this.step === this.parent.step;

        this.parent.stepChange.subscribe(step => {
            this.isCurrent = this.step === step;
        });
    }
}


@NgModule({
    imports: [CommonModule],
    declarations: [
        UIWizard,
        UIWizardStep
    ],
    exports: [
        UIWizard,
        UIWizardStep
    ]
})
export class UIWizardModule { }