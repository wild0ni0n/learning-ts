import Cmp from "./base-component";
import * as Validation from "./../util/validation";
import { Autobind as autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

//ProjectInput Class
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    manDayInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.manDayInputElement = this.element.querySelector('#manday') as HTMLInputElement;


        this.configure();
    }

    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredManday = this.manDayInputElement.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const mandayValidatable: Validation.Validatable = {
            value: +enteredManday,
            required: true,
            min: 1,
            max: 1000
        };

        if (
            !Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(mandayValidatable)
        ) {
            alert('入力値が正しくありません。');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredManday];
        }
    }
    private clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.manDayInputElement.value = '';

    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        //console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, manday] = userInput;
            projectState.addProject(title, desc, manday);
            this.clearInput();
        }
    }

}
