import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalService } from '../../../services/local.service';
import { ProjectService } from '../../../services/project.service';
import { NavbarComponent } from '../../../components/navigation/navbar/navbar.component';
import { SprintService } from '../../../services/sprint.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../services/category.service';
import { noLeadingSpaceValidator } from '../../../../core/validotors/no-leading-space-validator';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,NavbarComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  projectForm!: FormGroup;
  submit: boolean = false;
  formData=new FormData();
  file:any;
  categories: any;

  constructor(
    private router: Router,
    private _sprintService: SprintService,
    private _projectService: ProjectService,
    private formBuilder: FormBuilder,
    private _categoryService:CategoryService)
  {

  }  

  ngOnInit() {
    this.createForm();
    this.getCategory();
  }

  getCategory() {
    this._categoryService.getCategory().subscribe(
      (data: any) => {
        this.categories = data.resultData;
        this.categories=this.categories.filter((category: any) => category.isActive);
      },
      (error: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: error,
          showCloseButton: true,
          buttonsStyling: true,
        });
      }
    )
  }

  createForm() {
    this.projectForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required,noLeadingSpaceValidator()]),
      access: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required,noLeadingSpaceValidator()]),
      categoryId: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required,noLeadingSpaceValidator()]),
      clientCountry: new FormControl('', [noLeadingSpaceValidator()]),
      startDate: new FormControl('', [Validators.required,Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      endDate: new FormControl(null, [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      domain: new FormControl('', [Validators.required,noLeadingSpaceValidator()]),
      projectTimeline: new FormControl('', [Validators.required,noLeadingSpaceValidator()]),
    });
  }

  addProject() {
    this.submit = true;
    if (this.projectForm.valid) {
      this._projectService.addProject(this.projectForm.value).subscribe(
        (data:any) => {
          if(data.status){
            this.createSprint(data.resultData.id);
            if(this.file!=null && this.file!= undefined){
              this.uploadFile(this.file, data.resultData.id.toString());
            }
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              icon: 'success',
              timer: 5000,
              title: 'Project added successfully!!',
              showCloseButton: true,
              buttonsStyling: true,
            });
          }
          else{
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              icon: 'success',
              timer: 5000,
              title: 'Project creation failed!!',
              showCloseButton: true,
              buttonsStyling: true,
            });
          }
          this.router.navigate(['/project']);
        },
        (error: any) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: error,
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.router.navigate(['/project']);
        }
      );
    }
  }

  createSprint(id:any) {
    const sprint={
      name:'Sprint1',
      isCurrent: true,
      isFutureSprint:false,
      projectId:id
    }
    this._sprintService.postSprints(sprint).subscribe();
  }
  uploadFile(e:any,projectId:string){
    this.formData.append('projectId',projectId);
    this.formData.append('file',e?.target?.files[0]);
    this._projectService.UploadProjectDocument(this.formData).subscribe((data:any)=>{
    });
  }

  storeFile(e:any)
  {
    this.file = e;
  }

  get f() {
    return this.projectForm.controls;
  }
}
