import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/models/invoice.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-invoices-traceability',
  templateUrl: './invoices-traceability.component.html',
  styleUrls: ['./invoices-traceability.component.scss']
})
export class InvoicesTraceabilityComponent implements OnInit {
  @Input() invoices: Invoice[] = [];
  @Input() user!: User
  displayedColumns: string[] = ['number', 'date', 'client', 'cfdi', 'payment_method', 'total', 'total_pay', 'saldo', 'actions']
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = true
  constructor() {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.invoices);
    this.isDisabled = false
  }

  select(invoice: Invoice, select: boolean) {
    invoice.selected = select
  }

}
