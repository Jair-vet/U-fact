import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentPlugin } from 'src/app/models/payment-plugin.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-payments-plugins-traceability',
  templateUrl: './payments-plugins-traceability.component.html',
  styleUrls: ['./payments-plugins-traceability.component.scss']
})
export class PaymentsPluginsTraceabilityComponent implements OnInit {

  @Input() payments_plugins: PaymentPlugin[] = [];
  @Input() user!: User
  displayedColumns: string[] = ['number', 'date', 'client', 'total', 'actions']
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = true
  constructor() {

  }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource(this.payments_plugins);
    this.isDisabled = false
  }
  select(payment_plugin: PaymentPlugin, select: boolean) {
    payment_plugin.selected = select
  }
}
