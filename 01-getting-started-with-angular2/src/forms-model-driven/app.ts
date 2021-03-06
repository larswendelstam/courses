
import {Component} from "@angular/core";
import {NgModule} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";

import {
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
    ReactiveFormsModule
} from "@angular/forms";
import {Lesson, StudentLevel} from "./lesson";
import "rxjs/Rx";
import {validateDuration} from "./validateDuration";
import {checkIfTitleExists} from './checkIfTitleExists';


@Component({
    selector:'app',
    template: `

    <h3>Model Driven Forms</h3>
    
    <form [formGroup]="myForm" autocomplete="off" novalidate>
       <div class="form-field">
            <label>Title:</label>
            <input formControlName="title" required>
            <div class="field-error-message" 
                *ngIf="myForm.controls.title.dirty && myForm.controls.title.errors?.required">
                field is mandatory
            </div>
            <div class="field-error-message" 
                *ngIf="myForm.controls.title.dirty && myForm.controls.title.errors?.titleExists">
                This title already exists !
            </div>
        </div>
        <div class="form-field">
            <label>Duration:</label>
            <input [formControl]="duration">
        </div> 
        <div class="form-field">
            <label>Description:</label>
            <textarea formControlName="description"></textarea>
        </div>            
        <div class="form-field">
            <button class="lesson-button" type="submit">Create Lesson</button>
        </div>
    </form>
    
    <div class="debug">
        <h3>Title Errors:</h3>
        {{ myForm.controls.title?.errors | json }}
    </div>    
          

        `
})
export class App {

    myForm: FormGroup;

    duration = new FormControl(10, [validateDuration]);

    lesson = new Lesson(
        "Title goes here",
        0,
        "Description goes here",
        "Transcript goes here",
        StudentLevel.BEGINNER
    );

    constructor(fb: FormBuilder) {

        this.myForm = fb.group({
            title: ['This is the title', [
                    Validators.minLength(5) ]
                ],
            description: ['description goes here',[Validators.required]]
        });

        this.myForm.valueChanges
            .filter(() => this.myForm.valid)
            .map(value => new Lesson(value.title, value.duration,
                value.description,"",StudentLevel.BEGINNER))
            .do(formValue => console.log("Valid Form Value:", formValue))
            .subscribe(
                lesson => this.lesson = lesson
            );

    }

}




















@NgModule({
    declarations: [App],
    imports: [BrowserModule, ReactiveFormsModule],
    bootstrap: [App]
})
export class AppModule {

}

platformBrowserDynamic().bootstrapModule(AppModule);


