import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SprintService } from '../../services/sprint.service';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-sprint-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './complete-sprint-modal.component.html',
  styleUrl: './complete-sprint-modal.component.css'
})
export class CompleteSprintModalComponent {

  sprintIssues: any;
  sprintData: any;
  selectedOption: number =0;
  completedIssue: any;
  openIssue: any;
  projectId: any;

  constructor(
    private _sprintService: SprintService,
    @Inject(DIALOG_DATA) public data: any,
    private dialog:Dialog,
    private router: Router) {
    this.sprintIssues = data.sprintIssues;
    this.sprintData = data.sprintData
  }

  ngOnInit(): void {
    this.completedIssue = this.sprintIssues?.filter((item: any) => item.status === "Done").length;
    this.openIssue = this.sprintIssues.length - this.completedIssue
  }

  submit() {
    if (this.selectedOption == 0) {
    }
    else if (this.selectedOption == 1) {
      this.moveIssuesToNextSprint();
    }
    else {
      this.moveIssuesToBacklog();
    }
  }

  cancel() {
    this.dialog.closeAll();
  }

  moveIssuesToNextSprint() {
    this._sprintService.moveIssueNextSprint(this.sprintData.projectId, this.sprintData.id, this.sprintData.projectSprintId).subscribe((data: any) => {
      this.router.navigate(['/project/backlog']);
      this.cancel();
    })
  }

  moveIssuesToBacklog() {
    this._sprintService.moveIssueBacklog(this.sprintData.projectId, this.sprintData.id, this.sprintData.projectSprintId).subscribe((data: any) => {
      this.router.navigate(['/project/backlog']);
      this.cancel();
    })
  }

}
