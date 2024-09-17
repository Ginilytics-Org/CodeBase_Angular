import { Routes } from '@angular/router';
import { HeaderAndRouterOutletAndFoooterComponent } from './project/components/navigation/header-and-router-outlet-and-foooter/header-and-router-outlet-and-foooter.component';
import { BoardComponent } from './project/pages/private-pages/board/board.component';
import { LoginComponent } from './account/login/login.component';
import { ProjectListComponent } from './project/pages/private-pages/project-list/project-list.component';
import { IssueModalComponent } from './project/components/issue-modal/issue-modal.component';
import { BacklogComponent } from './project/pages/private-pages/backlog/backlog.component';
import { AddProjectComponent } from './project/pages/admin-pages/add-project/add-project.component';
import { IssueFilterComponent } from './project/pages/private-pages/issue-filter/issue-filter.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UserManagementComponent } from './project/pages/admin-pages/user-management/user-management.component';
import { ProjectCategoryComponent } from './project/pages/admin-pages/project-category/project-category.component';
import { ProjectDetailComponent } from './project/pages/admin-pages/project-detail/project-detail.component';
import { AppRoleGuard } from './core/guards/app-role.guard';
import { AccessComponent } from './project/pages/admin-pages/access/access.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { ResetPasswordComponent } from './account/reset-password/reset-password.component';

export const routes: Routes = [
  { 
    path: '',
    component: LoginComponent
  },
  { 
    path: 'forgetPassword',
    component: ForgetPasswordComponent
  },
  { 
    path: 'resetPassword/:token',
    component: ResetPasswordComponent
  },
  { 
    path: 'Signup/:token',
    component: SignUpComponent
  },
  { 
    path: 'users',
    component: UserManagementComponent, 
    canActivate:[AuthGuard,AppRoleGuard],
    data: { allowedRoles: [1] }
  }, 
  { 
    path: 'project',
    component: ProjectListComponent, 
    canActivate:[AuthGuard]
  }, 
  { 
    path: 'project/create',
    component: AddProjectComponent 
  },
  { 
    path: 'category',
    component: ProjectCategoryComponent 
  },
  { 
    path: 'project',
    component: HeaderAndRouterOutletAndFoooterComponent,
    canActivate:[AuthGuard],
    children: [ 
      {
        path: 'board',
        component: BoardComponent 
      }, 
      {
        path: 'issue/:id',
        component: IssueModalComponent
      },
      {
        path: 'backlog', 
        component: BacklogComponent
      },
      {
        path: 'issues', 
        component: IssueFilterComponent
      },
      {
        path: 'detail', 
        component: ProjectDetailComponent
      },
      {
        path: 'access', 
        component: AccessComponent
      }
    ]
  }
];
