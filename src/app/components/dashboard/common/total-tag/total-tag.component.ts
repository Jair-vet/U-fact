import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-tag',
  templateUrl: './total-tag.component.html',
  styleUrls: ['./total-tag.component.scss']
})
export class TotalTagComponent implements OnInit {
  @Input() total: number = 0;
  @Input() label: string = 'TOTAL';
  @Input() colorLabel: string = 'var(--primary)'
  @Input() isCurrency: boolean = true

  constructor() { }

  ngOnInit(): void {
  }

}
