import { Component } from '@angular/core';
import { DeleteCategoryComponent } from '../project-category/delete-category/delete-category.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { LocalService } from '../../../services/local.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { NavbarComponent } from '../../../components/navigation/navbar/navbar.component';
import { UserService } from '../../../services/user.service';
import { RemoveUserComponent } from './remove-user/remove-user.component';
import { AddUserInProjectModalComponent } from '../../../components/add-user-in-project-modal/add-user-in-project-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, SortPipe, RouterLink, DialogModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css'
})
export class AccessComponent {
  users: any;
  searchValue: string = '';
  pageSize: number = 20;
  totalPages!: number;
  pageNumber: number = 1;
  isSearchEmpty!: boolean;
  totalItems: any;
  filterUsers: any;
  sortField!: string;
  sortName: boolean = true;
  sortEmail: boolean = true;
  sortAscending: boolean = true;
  Project: any;
  loading: boolean= true;

  constructor(private _userService: UserService, private _localStore: LocalService, private dialog: Dialog) {
    const tokenDetail = _localStore.getData("tokenDetail");
    this.Project = this._localStore.getData('Project');
  }

  ngOnInit() {
    this.getUserByProjectId()
  }

  getUserByProjectId() {
    this._userService.getUserByProjectId(this.Project.id).subscribe(
      (data: any) => {
        if(data.status){
          this.users = data.resultData;
          this.loading = false;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Cannot fetch data!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
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
    );
  }


  get filteredData() {
    if (this.users != undefined) {
      if (this.pageNumber == 0) {
        this.pageNumber = 1;
      }
      this.isSearchEmpty = false;
      this.filterUsers = this.users.filter((user: any) =>
        user.userName.toLowerCase().includes(this.searchValue.toLowerCase()));
      this.totalItems = this.filterUsers.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.pageNumber > this.totalPages) {
        this.pageNumber = this.totalPages;
      }
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      if (this.totalItems == 0) {
        this.isSearchEmpty = true;
      }

      return this.filterUsers.slice(startIndex, endIndex);
    }
  }

  sortTable(field: string): void {
    if (field === 'userName') {
      this.sortName = !this.sortName;
    }
    else {
      this.sortEmail = !this.sortEmail;
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

  openDeleteDialog(userId: any) {
    const dialogRef = this.dialog.open(RemoveUserComponent, {
      minWidth: '300px',
      data: {
        userId: userId
      },
    });
    dialogRef.componentInstance?.confirmAction.subscribe((data: any) => {
      this.getUserByProjectId();
      if (data) {

        this.dialog.closeAll();
      }
      dialogRef.close();

    })
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserInProjectModalComponent, {
      minWidth: '300px',
      data: {
        users: this.users
      },
    });
    dialogRef.componentInstance?.confirmAction.subscribe((data: any) => {
      if (data) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          timer: 5000,
          title: 'User added successfully!!',
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.getUserByProjectId()
      }
      else{
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: 'Failed to add user!!',
          showCloseButton: true,
          buttonsStyling: true,
        });
      }
      dialogRef.close();
    })
  }

  updateRole(userId: any, roleId: any) {
    this._userService.updateRole(userId, this.Project.id, roleId).subscribe();
  }
}