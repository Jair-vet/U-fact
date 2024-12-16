import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Payment } from 'src/app/models/payment.model';

@Component({
  selector: 'app-payments-balance',
  templateUrl: './payments-balance.component.html',
  styleUrls: ['./payments-balance.component.scss']
})
export class PaymentsBalanceComponent implements OnInit {
  @Input() payments: Payment[] = [];
  @Input() total: number = 0;
  displayedColumns: string[] = ['folio', 'date', 'payment_method', 'total', 'total_in_use', 'saldo'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = true
  constructor() {

  }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource(this.payments);
    this.isDisabled = false
  }
}
