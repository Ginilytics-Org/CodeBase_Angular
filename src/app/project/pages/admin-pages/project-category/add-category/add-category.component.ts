import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  categoryForm = new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
    description:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(250)])
  })

  constructor(private _categoryService:CategoryService, private dialog:Dialog){}

  submit(){
    this.categoryForm.markAllAsTouched();
    if(this.categoryForm.invalid){
      return;
    }
    this._categoryService.addCategory(this.categoryForm.value).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Category added successfully!!',
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
            title: 'Category creation failed!!',
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
