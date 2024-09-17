import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navigation/navbar/navbar.component';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { LocalService } from '../../../services/local.service';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteProjectModalComponent } from './delete-project-modal/delete-project-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule,SortPipe,RouterLink],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {
  searchValue: string = '';
  projectList: any;
  isAppAdmin: boolean;
  UserId: number;
  pageSize: number = 20;
  totalPages!: number;
  pageNumber: number = 1;
  sortName: boolean = true;
  sortKey: boolean = true;
  sortAccess: boolean = true;
  sortCategoryName: boolean = true;
  sortCreated_By: boolean = true;
  sortCreated_at: boolean = true;
  sortField!: string;
  sort!: SortPipe;
  sortAscending: boolean = true;
  isSearchEmpty!: boolean;
  filteProjectList: any;
  totalItems: any;
  loading: boolean= true;
  constructor(private router: Router,
    private _projectService: ProjectService,
    private _localStore: LocalService,
    private dialog:Dialog) {
    const tokenDetail = this._localStore.getData("tokenDetail");
    this.UserId = tokenDetail.id
    this.isAppAdmin = tokenDetail.role == 'admin' ? true : false;
  }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    this._projectService.getProjectList(this.UserId).subscribe(
      (data: any) => {
        if(data.status){
          this.projectList = data.resultData
          this.loading=false;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: data.resultData,
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.loading=false;
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
    );
  }

  currentProject(project: any) {
    this._localStore.saveData('Project', JSON.stringify(project));
    this.router.navigate(['/project/board']);
  }
  get filteredData() {
    if (this.projectList != undefined) {
      if (this.pageNumber == 0) {
        this.pageNumber = 1;
      }
      this.isSearchEmpty = false;
      this.filteProjectList = this.projectList.filter((project: any) =>
        project.name.toLowerCase().includes(this.searchValue.toLowerCase()));
      this.totalItems = this.filteProjectList.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.pageNumber > this.totalPages) {
        this.pageNumber = this.totalPages;
      }
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      if (this.totalItems == 0) {
        this.isSearchEmpty = true;
      }

      return this.filteProjectList.slice(startIndex, endIndex);
    }
  }

  sortTable(field: string): void {
    if (field === 'name') {
      this.sortName = !this.sortName;
    }
    else if (field === 'key') {
      this.sortKey = !this.sortKey;
    }
    else if (field === 'access') {
      this.sortAccess = !this.sortAccess;
    }
    else if (field === 'categoryName') {
      this.sortCategoryName = !this.sortCategoryName;
    }
    else if (field === 'created_By') {
      this.sortCreated_By = !this.sortCreated_By;
    }
    else {
      this.sortCreated_at = !this.sortCreated_at;
    }
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      page = Number(page);
      if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
        this.pageNumber = page;
      }
    }
  }

  totalPageCount(): (number | string)[] {
    const limit = 2; // Set the desired limit of page numbers to display
    const ellipsis = '...'; // Define the ellipsis character or string

    let startPage = Math.max(1, this.pageNumber);
    let endPage = Math.min(startPage + limit - 1, this.totalPages);

    if (endPage - startPage + 1 < limit) {
      startPage = Math.max(1, endPage - limit + 1);
    }

    const pageNumbers: (number | string)[] = [];
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pageNumbers.push(ellipsis);
      }
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  deleteProject(projectId:number){
    this.dialog.open(DeleteProjectModalComponent, {
      minWidth: '300px',
      data: {
        projectId: projectId
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getProjectList();
    })
  }

}


