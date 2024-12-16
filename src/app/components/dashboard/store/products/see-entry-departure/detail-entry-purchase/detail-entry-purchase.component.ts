import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-entry-purchase',
  templateUrl: './detail-entry-purchase.component.html',
  styleUrls: ['./detail-entry-purchase.component.scss']
})
export class DetailEntryPurchaseComponent implements OnInit {

  @Input() provider: string = '';
  @Input() folio: string = '';


  constructor() { }

  ngOnInit(): void {
  }

}
