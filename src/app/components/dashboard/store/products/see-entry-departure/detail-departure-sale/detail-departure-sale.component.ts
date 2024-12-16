import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-departure-sale',
  templateUrl: './detail-departure-sale.component.html',
  styleUrls: ['./detail-departure-sale.component.scss']
})
export class DetailDepartureSaleComponent implements OnInit {
  @Input() client: string = '';
  @Input() folio: string = '';


  constructor() { }

  ngOnInit(): void {
  }


}
