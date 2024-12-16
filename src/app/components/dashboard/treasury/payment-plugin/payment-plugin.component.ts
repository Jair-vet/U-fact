import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/contact.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Payment } from 'src/app/models/payment.model';

import { PaymentService } from 'src/app/services/payment.service';

import Swal from 'sweetalert2';
import { InvoicesByClientComponent } from '../components/invoices-by-client/invoices-by-client.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentPluginService } from 'src/app/services/payment-plugin.service';

@Component({
  selector: 'app-payment-plugin',
  templateUrl: './payment-plugin.component.html',
  styleUrls: ['./payment-plugin.component.scss'],
})
export class PaymentPluginComponent implements OnInit {
  payment!: Payment;
  invoices: Invoice[] = [];
  loading: boolean = true;
  error: boolean = false;
  buttonDisabled = true;
  total_invoices: number = 0;

  idPayment: string = '0';
  error_msg: string = '';
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;
  displayedColumns: string[] = [
    'delete',
    'number',
    'uuid',
    'parcial',
    'sub_total',
    'tax',
    'total',
    'total_pay',
    'remaining',
  ];

  dataSource!: MatTableDataSource<any>;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _formBuider: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _paymentService: PaymentService,
    private _paymentPluginService: PaymentPluginService
  ) {
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
            this.colMedium = 12;
            this.colSmall = 6;
            this.modalWidth = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 6;
            this.modalWidth = '100%';
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 6;
            this.colSmall = 4;
            this.modalWidth = '80%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;
            this.modalWidth = '70%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 6;
            this.colMedium = 4;
            this.colSmall = 2;
            this.modalWidth = '50%';
          }
        }
      });

    this.idPayment = this._route.snapshot.paramMap.get('id_payment') || '0';
  }

  ngAfterViewInit() { }

  ngOnInit(): void {
    this.loadData();
  }

  deleteItem(invoice: Invoice) {
    this.invoices = this.invoices.filter(
      (item: Invoice) => item.id !== invoice.id
    );
    this.updateAllValors();
    this.loadTable();
  }

  clearData() {
    this.invoices = [];
    this.loadTable();
    this.updateAllValors();
  }

  loadTable() {
    this.dataSource = new MatTableDataSource(this.invoices);
  }

  updateValorsInvoice(invoice: Invoice) {
    console.log(invoice)

    if (invoice.input_total > invoice.total - invoice.total_pay) {
      invoice.input_total = Number(
        (invoice.total - invoice.total_pay).toFixed(2)
      );
    }
    if (invoice.is_international == 0) {
      invoice.sub_total = invoice.input_total / 1.16;
      invoice.tax = invoice.input_total - invoice.input_total / 1.16;
    } else {
      invoice.sub_total = invoice.input_total;
      invoice.tax = 0;
    }

    this.updateAllValors();
  }

  updateAllValors() {
    this.total_invoices = 0;
    this.invoices.forEach((invoice, key) => {
      this.total_invoices = Number(
        (this.total_invoices + invoice.input_total).toFixed(2)
      );
    });
    console.log(this.total_invoices);
    this.checkButton();
  }

  checkButton() {
    if (this.payment.add_payment_plugin) {
      if (
        this.payment.total - this.payment.total_in_use - this.total_invoices >=
        0 &&
        this.invoices.length > 0 &&
        this.total_invoices > 0
      ) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
    } else {
      this.buttonDisabled = true;
    }
  }

  calculateParcialidad(invoice: Invoice): number {
    invoice.parcialidad = invoice.parcialidad + 1;
    return invoice.parcialidad;
  }

  create() {
    this.loading = true;

    this._paymentPluginService
      .addPaymentPlugin(this.invoices, this.payment.id, this.total_invoices)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          Swal.fire({
            title: 'OK',
            text: resp,
            icon: 'success',
            confirmButtonColor: '#58B1F7',
            heightAuto: false,
          });
        },
        complete: () => {
          this.clearData();
          this.loadData();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'ERROR',
            text: err.error.message,
            icon: 'error',
            confirmButtonColor: '#58B1F7',
            heightAuto: false,
          });
          this.loadData();
        },
      });
  }

  loadData() {
    this._paymentService.getData(this.idPayment.toString()).subscribe({
      next: (resp) => {
        console.log(resp);
        this.payment = resp;
        if (!this.payment.add_payment_plugin) {
          this.error = true;
          this.error_msg =
            'ESTE PAGO NO ESTA DISPONIBLE PARA REALIZAR UN COMPLEMENTO';
        }
      },
      complete: () => {
        this.loading = false;
        this.checkButton();
      },
      error: (err) => {
        console.log(err);
        this.error = true;
        this.error_msg = err.error.message;
        this.loading = false;
      },
    });
  }

  openListInvoices() {
    const dialogRef = this.dialog.open(InvoicesByClientComponent, {
      width: '100%',
      height: 'auto',
      data: { invoicesSelected: this.invoices, paymentPlugin: this.payment },
    });
    dialogRef.componentInstance.dataChange.subscribe((updatedData) => {
      this.invoices = updatedData;
      this.loadTable();
      this.checkButton();
    });
  }

  cancel() {
    this._router.navigateByUrl('dashboard/payments');
  }

  ngOnDestroy() { }
}
