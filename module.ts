import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableExpandable } from './directives/table-expandable.directive';
import { TableStackable } from './directives/table-stackable.directive';
import { UIDropdown } from './directives/dropdown.directive';
import { UIAccordion } from './directives/accordion.directive';
import { TAB_DIRECTIVES } from './components/ui-tab';
import { DTPICKER_DIRECTIVES } from './components/ui-flatpickr';
// import {DTPICKER_DIRECTIVES} from './components/ui-rome';
// import {UIDatepickerComponent} from './ui-datepicker';
import { UIWizardModule } from './components/ui-wizard';
import { UISelectComponent } from './components/ui-select';
import { ToggleComponent } from './components/ui-toggle';
import { CheckboxComponent } from './components/ui-checkbox';
import { UILoaderComponent } from './components/ui-loader';
import { UISearchComponent } from './components/ui-search';
import { UIFormComponent, UIFormControlComponent, UIFormFieldComponent } from './components/ui-form';


@NgModule({
    imports: [CommonModule],
    declarations: [
        TableExpandable,
        TableStackable,
        UIDropdown,
        UIAccordion,
        TAB_DIRECTIVES,
        DTPICKER_DIRECTIVES,
        UIWizardModule,
        UISelectComponent,
        ToggleComponent,
        CheckboxComponent,
        UILoaderComponent,
        UISearchComponent,
        UIFormComponent, UIFormControlComponent, UIFormFieldComponent
    ],
    exports: [
        TableExpandable,
        TableStackable,
        UIDropdown,
        UIAccordion,
        TAB_DIRECTIVES,
        DTPICKER_DIRECTIVES,
        UIWizardModule,
        UISelectComponent,
        ToggleComponent,
        CheckboxComponent,
        UILoaderComponent,
        UISearchComponent,
        UIFormComponent, UIFormControlComponent, UIFormFieldComponent
    ]
})
export class Ng2BeanModule { }