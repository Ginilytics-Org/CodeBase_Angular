import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { SprintService } from '../../../services/sprint.service';
import { LocalService } from '../../../services/local.service';
import { DatePipe } from '@angular/common';
import { IssueService } from '../../../services/issue.service';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../services/category.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {
  projectForm!: FormGroup;
  submit: boolean = false;
  formData = new FormData();
  file: any;
  project: any;
  documentData: any;
  format: any;
  projectImage: any;
  loading: boolean= true;
  categories: any;
  users: any;

  constructor(
    private router: Router,
    private _localStore: LocalService,
    private _projectService: ProjectService,
    private formBuilder: FormBuilder,
    private _issueService: IssueService,
    private datePipe: DatePipe,
    private _userService: UserService,
    private _categoryService:CategoryService) {
    this.project = this._localStore.getData('Project');
    if(this.project.picture == null)
    this.projectImage="https://pmstudycircle.com/wp-content/uploads/2021/06/project.jpg.webp";
    else
    this.projectImage=this.project.picture;

  }

  ngOnInit() {
    this.createForm();
    this.GetDocuments();
    this.getCategory();
    this.getUsers();
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

  getUsers(){
    this._userService.getUserByProjectId(this.project.id).subscribe((data: any) => {
      this.users = data.resultData;
   });
   }

  createForm() {
    this.projectForm = this.formBuilder.group({
      id:new FormControl(this.project.id,[]),
      name: new FormControl(this.project.name, [Validators.required]),
      access: new FormControl(this.project.access, [Validators.required]),
      key: new FormControl(this.project.key, [Validators.required]),
      categoryId: new FormControl(this.project.categoryId, [Validators.required]),
      clientName: new FormControl(this.project.clientName, [Validators.required]),
      clientCountry: new FormControl(this.project.clientCountry, []),
      startDate: new FormControl(this.datePipe.transform(this.project.startDate, 'yyyy-MM-dd'), [Validators.required]),
      endDate: new FormControl(this.datePipe.transform(this.project.endDate, 'yyyy-MM-dd'), []),
      domain: new FormControl(this.project.domain, [Validators.required]),                                                                                                                                
      projectTimeline: new FormControl(this.project.projectTimeline, [Validators.required]),
      leadId: new FormControl(this.project.leadId, [Validators.required]),
      picture: new FormControl(this.projectImage, ),
      });
      this.loading=false;
  }

  GetDocuments() {
    if (this.project?.id != undefined) {
      this._projectService.GetProjectDocuments(this.project?.id).subscribe((data: any) => {
        this.documentData = data.resultData;
        this.loading=false;
      });
    }
  }

  UploadFile(e: any) {
    const formData = new FormData();
    formData.append('projectId', this.project.id);
    formData.append('file', e?.target?.files[0]);
    this._issueService.UploadProjectDocument(formData).subscribe((data: any) => {
      this.GetDocuments();
    });
  }

  previewFile(filepath: string, contentType: string) {
    this._issueService.previewDocument(filepath).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  cancelFile(Data: string) {
    this._projectService.DeleteProjectDocument(Data).subscribe((data: any) => {
      this.GetDocuments();
    });

  }

  downloadFile(filepath: string, contentType: string, fileName: string) {

    this._issueService.DownloadDocument(filepath).subscribe((response) => {
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
  }

  onSelectCoverPic(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // File size exceeds 10MB, display popup or show an error message
        window.alert(
          'File size should be less than 10MB',
        );
        return;
      }

      const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedFormats.includes(file.type)) {
        // File format is not supported, display popup or show an error message
      window.alert(
          'Only PNG, JPEG, and JPG formats are allowed');
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(file);

      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }

      reader.onload = (event) => {
        this.projectImage = (<FileReader>event.target).result;
      };
    }
  }

  editProject() {
    this.projectForm.markAllAsTouched();
    if (this.projectForm.invalid) {
      return;
    }
    this.loading=true
    this.projectForm.controls['picture'].setValue(this.projectImage);
    this._projectService.updateProject(this.projectForm.value).subscribe(
      (data:any)=> {
        if(data.resultData){
          let Project=this._localStore.getData('Project');
          Project = { ...Project, ...this.projectForm.value };
          this._localStore.saveData('Project',JSON.stringify(Project));
          this.loading = false;
        }
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
        this.loading = false;
      }
    )
  }
}
