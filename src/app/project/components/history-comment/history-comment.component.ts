import { Component, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history-comment',
  standalone: true,
  imports: [],
  templateUrl: './history-comment.component.html',
  styleUrl: './history-comment.component.css'
})
export class HistoryCommentComponent {
  @Input() issue:any;
  mergedData: any=[];
createMode: any;
loading: boolean= true;

  constructor(private commentService:CommentService,private historyService:HistoryService){}

  ngOnInit(): void {
    this.fetchData();
  }
  

  fetchData() {
    this.CommentData();
    this.HistoryData();
  }

  CommentData() {
    this.loading=true;
    this.commentService.getCommentByIssueId(this.issue.id).subscribe((data: any) => {
      this.mergedData.push(...data.map((comment: any) =>({ type: 'comment', data: comment })));
      this.sortMergedData();
      this.loading=false;
    });
  }
  
  
  HistoryData() {
    this.loading=true;
    this.historyService.GetHistoriesByIssueId(this.issue.id).subscribe((data: any) => {
      this.mergedData.push(...data.map((history: any) =>({ type: 'history', data: history })));
      this.sortMergedData();
      this.loading=false;
    });
  }

  sortMergedData() {
    this.mergedData.sort((a:any,b:any) => {
      const aDate = a.type === 'comment' ? new Date(a.data.date) : new Date(a.data.modifiedDate);
      const bDate = b.type === 'comment' ? new Date(b.data.date) : new Date(b.data.modifiedDate);
      return bDate.getTime() - aDate.getTime();
    });
  }

  getFormattedValue(value: any): string{
    if (value === null) {
      return '0';
    } else {
      const strippedHtml = value.toString().replace(/<[^>]+>/g, '');
      return strippedHtml;
    }
  }    

  getPrefixForAction(action:any) {
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

  calculateCommentElapsedTime(comment:any): string {
    var modifiedDate = new Date(comment.date);
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
