import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { LocalService } from '../../../services/local.service';
import { NavbarComponent } from '../../../components/navigation/navbar/navbar.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { RouterLink } from '@angular/router';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-category',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, SortPipe, RouterLink, DialogModule],
  templateUrl: './project-category.component.html',
  styleUrl: './project-category.component.css'
})
export class ProjectCategoryComponent implements OnInit{
  categories: any;
  searchValue: string = '';
  pageSize: number = 20;
  totalPages!: number;
  pageNumber: number = 1;
  isSearchEmpty!: boolean;
  totalItems: any;
  filteCategory: any;
  sortField!: string;
  sortAscending: boolean = true;
  sortName: boolean=false;
  sortDescription: boolean=false;
  loading: boolean= true;

  constructor(private _categoryService:CategoryService, private _localStore:LocalService, private dialog:Dialog){
    const tokenDetail=_localStore.getData("tokenDetail");
  }

  ngOnInit(){
    this.getCategory()
  }

  getCategory() {
    this._categoryService.getCategory().subscribe(
      (data: any) => {
        this.categories = data.resultData;
        this.loading=false
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

  get filteredData() {
    if (this.categories != undefined) {
      if (this.pageNumber == 0) {
        this.pageNumber = 1;
      }
      this.isSearchEmpty = false;
      this.filteCategory = this.categories.filter((category: any) =>
        category.name.toLowerCase().includes(this.searchValue.toLowerCase()));
      this.totalItems = this.filteCategory.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.pageNumber > this.totalPages) {
        this.pageNumber = this.totalPages;
      }
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      if (this.totalItems == 0) {
        this.isSearchEmpty = true;
      }

      return this.filteCategory.slice(startIndex, endIndex);
    }
  }

  sortTable(field: string): void {
    if (field === 'name') {
      this.sortName = !this.sortName;
    }
    else if (field === 'description') {
      this.sortDescription = !this.sortDescription;
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

  openDeleteDialog(categoryId:any) {
    const dialogRef=this.dialog.open(DeleteCategoryComponent, {
      minWidth: '300px',
      data: {
        categoryId: categoryId
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCategory();
    })
    // dialogRef.componentInstance?.confirmAction.subscribe((data:any)=>{
    //   if(data){
    //     this.dialog.closeAll();
    //   }
    //   dialogRef.close();
      
    // })
  }

  openAddDialog() {
    this.dialog.open(AddCategoryComponent, {
      minWidth: '300px',
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCategory();
    })
  }

  openEditDialog(category: any) {
    this.dialog.open(EditCategoryComponent, {
      minWidth: '300px',
      data: {
        category: category
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCategory();
    })
  }
}
