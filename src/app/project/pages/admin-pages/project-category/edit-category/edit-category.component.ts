import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent{

  categoryForm = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    description:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(250)]),
    isActive:new FormControl('',[Validators.required])
  })
  category: any;

  constructor(@Inject(DIALOG_DATA) data:any, private _categoryService:CategoryService, private dialog:Dialog){
    this.category=data.category;
    this.categoryForm.patchValue({
      name:data.category.name,
      description:data.category.description,
      isActive:data.category.isActive,
    })
  }

  submit(){
    this.categoryForm.markAllAsTouched();
    if(this.categoryForm.invalid){
      return;
    }
    this.category.name=this.categoryForm.value.name
    this.category.description=this.categoryForm.value.description
    this.category.isActive=this.categoryForm.value.isActive
    this._categoryService.updateCategory(this.category).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Category updated successfully!!',
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
            title: 'Category updation failed!!',
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
