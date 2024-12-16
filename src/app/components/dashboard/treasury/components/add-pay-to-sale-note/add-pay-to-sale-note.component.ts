import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Departure } from 'src/app/models/departure.model';
import { Payment } from 'src/app/models/payment.model';
import { PaymentDeparture } from 'src/app/models/payment_departure.model';
import { DepartureService } from 'src/app/services/departure.service';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { PreviewInvoiceComponent } from '../../../invoices/components/preview-invoice/preview-invoice.component';
import { CreatePaymentComponent } from '../create-payment/create-payment.component';

@Component({
  selector: 'app-add-pay-to-sale-note',
  templateUrl: './add-pay-to-sale-note.component.html',
  styleUrls: ['./add-pay-to-sale-note.component.scss'],
})
export class AddPayToSaleNoteComponent implements OnInit {
  total_pay: number = 0;
  error: boolean = false;
  loading: boolean = true;
  error_msg: string = '';
  colBig!: number;
  colMedium!: number;
  form: FormGroup;
  payments!: Payment[];
  paymentDeparture!: PaymentDeparture;
  departures: Departure[] = [];
  addPay: boolean = false;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  public paymentsCtrl: FormControl = new FormControl();
  public paymentsFilterCtrl: FormControl = new FormControl();
  public filteredPayments: ReplaySubject<Payment[]> = new ReplaySubject<
    Payment[]
  >(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Departure,
    public dialogRef: MatDialogRef<CreatePaymentComponent>,
    private dialog: MatDialog,
    private _departureService: DepartureService,
    private _formBuider: FormBuilder,
    private _paymentService: PaymentService,
    private breakpointObserver: BreakpointObserver
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
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 12;
            this.colMedium = 3;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 12;
            this.colMedium = 2;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 12;
            this.colMedium = 2;
          }
        }
      });
    this.form = this._formBuider.group({
      total: ['0.00', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDataSaleNote();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadPayments() {
    this.loading = true;
    this._paymentService.getDataByClient(this.data.id_client).subscribe({
      next: (resp) => {
        console.log(resp);
        this.payments = resp.filter(
          (item: Payment) =>
            Number(item.total.toFixed(2)) -
              Number(item.total_in_use.toFixed(2)) >
              0 && item.is_dollars == this.data.is_dollars
        );
      },
      complete: () => {
        this.loadComponentSelectPayments();
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadDeparture() {
    this.loading = true;
    console.log(this.data.id);
    this._departureService.getDeparture(this.data.id.toString()).subscribe({
      next: (resp) => {
        this.data = resp;
        this.departures = [];
        this.departures.push(this.data);
        this.payments = resp.payments;
      },
      complete: () => {
        this.loading = false;
        this.openPreviewInvoice();
      },
      error: (err) => {
        this.loading = false;

        this.error = true;
        this.error_msg = err.error.message;
      },
    });
  }

  loadDataSaleNote() {
    this.loading = true;
    this._paymentService.getDataByDeparture(this.data.id).subscribe({
      next: (resp) => {
        console.log(resp);
        this.loadPayments();
        this.total_pay = resp.total;
      },
      complete: () => {},
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.error_msg = err.error.message;
        console.log(err);
      },
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadComponentSelectPayments() {
    this.filteredPayments.next(this.payments.slice());
    this.paymentsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPayments();
      });
  }

  protected setInitialValue() {
    this.filteredPayments
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Payment, b: Payment) =>
          a && b && a.id === b.id;
      });
  }

  protected filterPayments() {
    if (!this.payments) {
      return;
    }
    let search = this.paymentsFilterCtrl.value;
    if (!search) {
      this.filteredPayments.next(this.payments.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPayments.next(
      this.payments.filter(
        (payment) => payment.folio.toLowerCase().indexOf(search) > -1
      )
    );
  }

  clearFields() {
    this.form.reset({
      total: '0.00',
    });
    this.paymentsCtrl.reset();
    this.loadPayments();
  }

  createPaymentToSaleNote() {
    if (this.form.value.total <= 0 || this.paymentsCtrl.value == null) {
      Swal.fire({
        title: 'ERROR',
        text: 'EL TOTAL INGRESADO ES MENOR A 0 O EL PAGO NO HA SIDO SELECCIONADO',
        icon: 'error',
        heightAuto: false,
      });
    } else if (
      this.form.value.total >
        Number(this.data.total - this.total_pay).toFixed(2) ||
      this.form.value.total >
        Number(
          this.paymentsCtrl.value.total - this.paymentsCtrl.value.total_in_use
        ).toFixed(2)
    ) {
      Swal.fire({
        title: 'ERROR',
        text: 'EL TOTAL INGRESADO ES MAYOR AL TOTAL A PAGAR O ES MAYOR AL PAGO',
        icon: 'error',
        heightAuto: false,
      });
    } else {
      this.loading = true;
      this._paymentService
        .addPaymentToSaleNote(
          this.data.id,
          this.paymentsCtrl.value.id,
          this.form.value.total
        )
        .subscribe({
          next: (resp) => {
            this.clearFields();
            this.paymentDeparture = resp.data;
            Swal.fire({
              title: 'OK',
              text: resp.message,
              icon: 'success',
              confirmButtonColor: '#58B1F7',
              heightAuto: false,
            });
          },
          complete: () => {
            this.dataChange.emit(this.addPay);
            this.loadDeparture();
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
            this.loading = false;
          },
        });
    }
  }

  openPreviewInvoice() {
    if (this.departures.length > 0) {
      this.departures[0].total_invoice =
        this.departures[0].total_invoice + this.paymentDeparture.total;
      this.departures[0].payment_method =
        this.paymentDeparture.id_payment_method_invoice.toString();
      const dialogRef = this.dialog.open(PreviewInvoiceComponent, {
        disableClose: false,
        width: '1050px',
        height: '700px',
        data: {
          departures: this.departures,
          is_pue: true,
          total_pay: this.paymentDeparture.total,
          id_payment_departure: this.paymentDeparture.id,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.departures[0].total_invoice =
          this.departures[0].total_invoice - this.paymentDeparture.total;
        this.loadDataSaleNote();
      });
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'NO HAZ SELECCIONADO NINGUNA SALIDA',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }
}
