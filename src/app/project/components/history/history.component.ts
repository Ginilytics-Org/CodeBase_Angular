import { Component, Input, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  @Input() issue:any;
  histories: any;
createMode: any;
loading: boolean= true;

  constructor(private historyService:HistoryService){}

  ngOnInit(){
    this.historyData();
  }

  historyData(){
    this.historyService.GetHistoriesByIssueId(this.issue.id).subscribe(
      (data:any)=> {
      this.histories = data;
      this.loading=false;
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
        this.loading=false;
      }
    );
  }

  getFormattedValue(value: any): string {
    if (value === null) {
      return '0';
    } else {
      const strippedHtml = value.toString().replace(/<[^>]+>/g, '');
      return value;
    }
  }    

  getPrefixForAction(action: any) {
    if(action=="Issue"){
      return 'this';
    }
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const firstLetter = action.charAt(0).toLowerCase(); 
    if (vowels.includes(firstLetter)) {
      return 'an';
    } else {
      return 'the';
    }
  }

  calculateElapsedTime(history:any): string {
    var modifiedDate = new Date(history.modifiedDate);
    const timezoneOffset = modifiedDate.getTimezoneOffset();
    modifiedDate= new Date(modifiedDate.getTime() - timezoneOffset * 60 * 1000);
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime.getTime() - modifiedDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds ago`;
    } else if (elapsedSeconds < 3600) {
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      return `${elapsedMinutes} minutes ago`;
    } else if (elapsedSeconds < 86400) {
      const elapsedHours = Math.floor(elapsedSeconds / 3600);
      return `${elapsedHours} hours ago`;
    } else {
      const elapsedDays = Math.floor(elapsedSeconds / 86400);
      return `${elapsedDays} days ago`;
    }
  }
}
