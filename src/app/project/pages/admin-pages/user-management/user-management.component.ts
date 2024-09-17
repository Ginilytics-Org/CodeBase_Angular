import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { LocalService } from '../../../services/local.service';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { NavbarComponent } from '../../../components/navigation/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EditUserModalComponent } from '../../../components/edit-user-modal/edit-user-modal.component';
import { AddUserModalComponent } from '../../../components/add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, SortPipe, RouterLink, DialogModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  searchValue: string = '';
  userList: any;
  UserId: number;
  pageSize: number = 20;
  totalPages!: number;
  pageNumber: number = 1;
  sortName: boolean = true;
  sortEmail: boolean = true;
  sortRole: boolean = true;
  sortField!: string;
  sort!: SortPipe;
  sortAscending: boolean = true;
  isSearchEmpty!: boolean;
  filteProjectList: any;
  totalItems: any;
  constructor(
    private router: Router,
    private _userService: UserService,
    private _localStore: LocalService,
    private dialog: Dialog
  ) {
    const tokenDetail = this._localStore.getData("tokenDetail");
    this.UserId = tokenDetail.id
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this._userService.getUser().subscribe((data: any) => {
      this.userList = data.resultData;
    });
  }

  get filteredData() {
    if (this.userList != undefined) {
      if (this.pageNumber == 0) {
        this.pageNumber = 1;
      }
      this.isSearchEmpty = false;
      this.filteProjectList = this.userList.filter((project: any) =>
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
    else if (field === 'email') {
      this.sortEmail = !this.sortEmail;
    }
    else {
      this.sortRole = !this.sortRole;
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

  editUserModal(user: any) {
    this.dialog.open(EditUserModalComponent, {
      minWidth: '600px',
      data: {
        UserData: user,
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getUsers();
    })
  }

  addUserModal() {
    this.dialog.open(AddUserModalComponent, {
      minWidth: '600px',
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getUsers();
    })
  }
}

