import { Project, ProjectStatus } from "../models/project.js";
import { ProjectItem } from "./project-item.js";
import { projectState } from "../state/project-state.js";
import { DragTarget } from "../models/drag-drop.js";
import Cmp from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";

// ProjectList Class
export class ProjectList extends Cmp<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = [];

        this.configure();
        this.renderContent();

    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }

    }

    @Autobind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @Autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);


        projectState.addListener((projects: Project[]) => {
            const relevantProject = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProject;
            this.renderProjects();
        });
    }

    renderContent() {
        const listid = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listid;
        this.element.querySelector('h2').textContent = this.type === 'active' ? '実行中のプロジェクト' : '完了プロジェクト';
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(listEl.id, prjItem);
        }
    }

}
