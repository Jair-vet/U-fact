import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  EventEmitter,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConceptForm } from 'src/app/interfaces/concept-form.interface';
import { BankAccount } from 'src/app/models/bank-account.model';
import { Departure } from 'src/app/models/departure.model';
import { Invoice } from 'src/app/models/invoice.model';
import { CFDI, WayPay } from 'src/app/models/sat.model';
import { User } from 'src/app/models/user.model';
import { BankAccountService } from 'src/app/services/bank-account.service';

import { InvoiceService } from 'src/app/services/invoice.service';

import { SatService } from 'src/app/services/sat.service';
import { ToolService } from 'src/app/services/tools.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss'],
})
export class PreviewInvoiceComponent implements OnInit {
  error = false;
  user!: User;
  error_msg = '';
  invoice!: Invoice;
  loading: Boolean = true;
  concepts: ConceptForm[] = [];
  isDisabled: BooleanInput = false;
  cfdi: CFDI[] = [];
  wayPays: WayPay[] = [];
  cfdiValue: number = 1;
  account: number = 1
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;
  id_way_pay: number = 22;
  way_pay: string = '';
  payment_method: string = '';
  id_payment_method: number = 0;
  is_dollars: boolean = false;
  exchange_rate: number = 1;
  created_pay: boolean = false;
  accounts: BankAccount[] = []

  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _bankAccountService: BankAccountService,
    private dialogRef: MatDialogRef<PreviewInvoiceComponent>,
    private _satService: SatService,
    private _userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private _invoiceService: InvoiceService,
    private _toolsService: ToolService
  ) {
    console.log(data)
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
            this.colBig = 6;
            this.colMedium = 6;
            this.colSmall = 3;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 6;
            this.colMedium = 6;
            this.colSmall = 3;
          }
        }
      });
    this.user = this._userService.user;
  }

  converterToLabel(code: string, description: string, limit: number) {
    return `${code} - ${description}`.length > limit
      ? `${code} - ${description}`.substring(0, limit - 3) + '...'
      : `${code} - ${description}`;
  }

  validateSalesNotesDollarsAndMXN(mxn: number, dollars: number): boolean {
    if (mxn > 0 && dollars == 0) {
      this.is_dollars = false;
      return true;
    }
    if (mxn == 0 && dollars > 0) {
      this.is_dollars = true;
      return true;
    }
    if (mxn == 0 && dollars == 0) {
      return false;
    }
    if (mxn > 0 && dollars > 0) {
      return false;
    } else {
      return false;
    }
  }

  loadData() {
    this._invoiceService
      .generateInvoice(
        this.data.departures,
        this.data.is_pue,
        this.data.total_pay,
        this.data.is_international
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.invoice = resp;
        },
        complete: () => {
          this.loading = false;
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
          this.error_msg = err.error.message;
        },
      });
  }

  loadExchangeRate() {
    if (this.is_dollars) {
      this._toolsService.getExchangeRateToDollars().subscribe({
        next: (resp) => {
          console.log(resp);
          this.exchange_rate = resp.value;
        },
        complete: () => {
          this.loadCDFIs();
        },
        error: (err) => {
          console.log(err);
          this.error = true;
          this.loading = false;
          this.error_msg = 'ERROR AL OBTENER LA TASA DE CAMBIO';
        },
      });
    } else {
      this.loadCDFIs();
    }
  }

  loadCDFIs() {
    this._satService.getCFDI().subscribe({
      next: (resp) => {
        this.cfdi = resp;
        if (this.data.is_international) {
          this.cfdiValue = 22
        }

      },
      complete: () => {
        this.loadAccounts()
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.error_msg = err.error.message;
      },
    });
  }

  loadAccounts() {
    this._bankAccountService.getAllData(false).subscribe({
      next: (resp) => {
        this.accounts = resp;
      },
      complete: () => {
        this.loadData();
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.error_msg = err.error.message;
      },
    });
  }

  loadWayPays() {
    this._satService.getWayPays().subscribe({
      next: (resp) => {
        this.wayPays = resp;
      },
      complete: () => {
        this.loadExchangeRate();
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.error_msg = err.error.message;
      },
    });
  }

  cfdiChange(event: any) {
    this.cfdiValue = event.target.value;
  }
  accountChange(event: any) {
    this.account = event.target.value;
  }
  wayPayChange(event: any) {
    this.id_way_pay = event.target.value;
  }

  ngOnInit(): void {
    this.validateSalesNotes();
  }

  validateSalesNotes() {
    let i = 0;
    let countSaleNoteWithPayments = 0;
    let countSaleNoteWithoutPayments = 0;
    let salesNotesDollars = 0;
    let salesNotesMXN = 0;
    while (i < this.data.departures.length) {
      if (this.data.departures[i].payments.length > 0) {
        countSaleNoteWithPayments++;
      }
      if (this.data.departures[i].payments.length == 0) {
        countSaleNoteWithoutPayments++;
      }
      if (this.data.departures[i].is_dollars) {
        salesNotesDollars++;
      }
      if (!this.data.departures[i].is_dollars) {
        salesNotesMXN++;
      }
      i++;
    }



    if (
      this.validateSalesNotesDollarsAndMXN(salesNotesMXN, salesNotesDollars)
    ) {
      if (countSaleNoteWithPayments > 0 && countSaleNoteWithoutPayments > 0) {
        this.error = true;
        this.loading = false;
        this.error_msg = 'NO ES POSIBLE ESTA COMBINACIÓN';
      } else {
        if (countSaleNoteWithPayments > 0) {
          this.id_payment_method = 1;
          this.id_way_pay = 1;
          this.payment_method = 'PUE PAGO EN UNA SOLA EXHIBICIÓN';
        }
        if (countSaleNoteWithoutPayments > 0) {
          this.id_payment_method = 2;
          this.id_way_pay = 22;
          this.payment_method = 'PPD PAGO EN PARCIALIDADES O DIFERIDO';
        }
        this.loadWayPays();
      }
    } else {
      this.error = true;
      this.loading = false;
      this.error_msg =
        'NO ES POSIBLE COMBINAR NOTAS DE VENTA CON DISTINTA MONEDA';
    }
    if (this.data.is_pue) {
      this.id_way_pay = this.data.departures[0].payment_method;
    }
  }

  stampInvoice() {
    this.loading = true;

    this._invoiceService
      .stampInvoice(
        this.invoice,
        this.data.departures,
        this.cfdiValue,
        this.id_way_pay,
        this.id_payment_method,
        this.is_dollars ? 2 : 1,
        2,
        this.is_dollars ? this.exchange_rate : 1,
        this.data.id_payment_departure,
        this.account,
        this.data.is_international,
        this.data.id_exportation
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        complete: () => {
          this.loading = false;
          Swal.fire({
            title: 'Ok',
            text: 'TIMBRADA',
            icon: 'success',
            confirmButtonColor: '#58B1F7',
            heightAuto: false,
          });
          this.dataChange.emit(this.dataChange);
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
          Swal.fire({
            title: 'ERROR',
            text: err.error.message,
            icon: 'error',
            confirmButtonColor: '#58B1F7',
            heightAuto: false,
          });
        },
      });
  }
}
