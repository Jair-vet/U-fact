import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryInterface } from 'src/app/interfaces/inventory-form.interface';
import { Invoice } from 'src/app/models/invoice.model';
import { PaymentPlugin } from 'src/app/models/payment-plugin.model';
import { User } from 'src/app/models/user.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invoices-by-client',
  templateUrl: './invoices-by-client.component.html',
  styleUrls: ['./invoices-by-client.component.scss'],
})
export class InvoicesByClientComponent implements OnInit {
  waiting = false;
  error = false;
  error_msg = '';

  loading: Boolean = true;

  invoices: Invoice[] = [];
  isDisabled: BooleanInput = false;
  displayedColumns: string[] = [
    'number',
    'uuid',
    'date',
    'client',
    'payment_method',
    'parcial',
    'total',
    'total_pay',
    'actions',
  ];

  dataSource!: MatTableDataSource<any>;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;
  user!: User;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private _invoiceService: InvoiceService
  ) {
    this.user = _userService.user;
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.colBig = 12;
            this.colSmall = 12;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.colSmall = 6;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 6;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 9;
            this.colMedium = 6;
            this.colSmall = 3;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 9;
            this.colMedium = 6;
            this.colSmall = 3;
          }
        }
      });
  }

  setUUID(uuid: string) {
    return uuid.length > 20 ? uuid.substring(0, 20 - 3) + '...' : uuid;
  }

  loadData() {
    this.waiting = true;
    this.loading = true;
    this._invoiceService
      .getInvoicesByClient(this.data.paymentPlugin.id_client.toString(), '2')
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.invoices = resp.filter(
            (item: Invoice) =>
              item.id_type_currency ==
              (this.data.paymentPlugin.is_dollars ? 2 : 1)
          );

          this.dataSource = new MatTableDataSource(this.invoices);
        },
        complete: () => {
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  checkItemSelect(invoice: Invoice) {
    return this.data.invoicesSelected.find(
      (item: Invoice) => item.id === invoice.id
    ) && invoice.total > invoice.total_pay
      ? true
      : false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  select(invoice: Invoice, select: boolean) {
    if (invoice.total > invoice.total_pay) {
      if (select) {
        const object: Invoice = { ...invoice };
        this.data.invoicesSelected.push(object);
        this.dataChange.emit(this.data.invoicesSelected);
      } else {
        this.data.invoicesSelected = this.data.invoicesSelected.filter(
          (item: Invoice) => item.id !== invoice.id
        );
        this.dataChange.emit(this.data.invoicesSelected);
      }
    }
  }
}
