import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { SprintService } from '../../services/sprint.service';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-start-sprint',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './start-sprint.component.html',
  styleUrl: './start-sprint.component.css'
})
export class StartSprintComponent implements OnInit{
  SprintId: any;
  IsActive: any;
  SprintData: any;
  sprintForm! : FormGroup;
  selectedOption!: string;
  ProjectId: any;

  constructor(private _localStore:LocalService, private datePipe: DatePipe, private _sprintService:SprintService, @Inject(DIALOG_DATA) public data: any, private dialog:Dialog){
    const Project = this._localStore.getData('Project');
    this.ProjectId=Project.id;
    this.SprintId=data.SprintId;
    this.IsActive=data.IsActive;
    this.SprintData=data.SprintData;
  }

  get f() {
    return this.sprintForm?.controls;
  }

  ngOnInit(): void {
    this.sprintForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      startDate: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      endDate: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      description: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required])
    })

    this.sprintForm.patchValue({
      name: this.SprintData.name,
      startDate: this.SprintData.startData,
      endDate: this.SprintData.endDate,
      description: this.SprintData.description,
      duration: this.SprintData.duration
    })
    if(this.SprintData.startDate!=='0001-01-01T00:00:00'){
      this.sprintForm.patchValue({
        startDate: this.datePipe.transform(this.SprintData.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.SprintData.endDate, 'yyyy-MM-dd'),
      });
      this.selectedOption = this.calculateDuration();
    }
  }

  calculateDuration(){
    const differenceInDaysValue = differenceInDays(new Date(this.SprintData.endDate), new Date( this.SprintData.startDate));
    const differenceInMonthsValue = differenceInMonths(new Date(this.SprintData.endDate), new Date( this.SprintData.startDate));
    if (differenceInDaysValue === 7) {
      return "2";
    } else if (differenceInDaysValue === 14) {
      return "3";
    } else if (differenceInMonthsValue === 1 && differenceInDaysValue % 30 !== 0) {
      return "4";
    } else {
      return "1";
    }
  }

  setDateRange() {
    if (this.selectedOption !="1") {
      let today = new Date();
      let endDate = new Date();
      switch (this.selectedOption) {
        case '2':
          endDate.setDate(today.getDate() + 7);
          break;
        case '3':
          endDate.setDate(today.getDate() + 14);
          break;
        case '4':
          endDate.setMonth(today.getMonth() + 1);
          break;
      }
      this.sprintForm.patchValue({
        startDate: today.toISOString().slice(0, 10),
        endDate:endDate.toISOString().slice(0, 10),
      });
    }
    else{
      this.sprintForm.patchValue({
        startDate: null,
        endDate:null,
      });
    }
  }

  submitForm() {
    this.sprintForm.markAllAsTouched();
    if (this.sprintForm.invalid) {
      return;
    }

    const sprint={
      name:this.sprintForm.value.name,
      startDate:this.sprintForm.value.startDate,
      endDate:this.sprintForm.value.endDate,
      projectId:this.ProjectId,
      description:this.sprintForm.value.description,
      id:this.SprintData.id,
      isActive:this.IsActive,
    }
    this._sprintService.updateSprint(sprint).subscribe((data:any) => {
      this.dialog.closeAll();
    })
  }

  cancel(){
    this.dialog.closeAll();
  }

}
