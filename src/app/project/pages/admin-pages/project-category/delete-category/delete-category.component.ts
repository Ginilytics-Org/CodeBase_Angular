import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css'
})
export class DeleteCategoryComponent {

  constructor(@Inject(DIALOG_DATA) public data: any, private _categoryService:CategoryService,private dialog:Dialog){}


  confirm(){
    if(this.data.categoryId == null || this.data.categoryId == undefined){
      return;
    }
    
    this._categoryService.deleteCategory(this.data.categoryId).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Category Deleted successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Category Deletion failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        this.dialog.closeAll();
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
        this.dialog.closeAll();
      }
    )
  }

  cancel(){
    this.dialog.closeAll();
  }
}
