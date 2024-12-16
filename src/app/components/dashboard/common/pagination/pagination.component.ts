import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() labelPage: number = 0;
  @Input() loading: boolean = true;
  @Input() numberPage: number = 0;
  @Output() numberPageEmitter: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  changeNumberPage(page: number) {
    if (!this.loading) {
      if (page == 1) {
        this.numberPage++
      } else if (page == -1) {
        this.numberPage--
      }
      if (this.numberPage < 1 || this.numberPage == null) {
        this.numberPage = 1

      } else if (this.numberPage > this.labelPage) {
        this.numberPage = this.labelPage
      }
      this.numberPageEmitter.emit(this.numberPage)
    }

  }



}
