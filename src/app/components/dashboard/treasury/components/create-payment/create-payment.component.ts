import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FunctionsService } from 'src/app/services/helpers.service';
import { PaymentForm } from 'src/app/interfaces/payment-form.interface';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';
import { CatalogClientsComponent } from '../../../orders/components/catalog-clients/catalog-clients.component';
import { ToolService } from 'src/app/services/tools.service';
import { BankAccount } from 'src/app/models/bank-account.model';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { BankAccountService } from 'src/app/services/bank-account.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss'],
})
export class CreatePaymentComponent implements OnInit {
  error = false;
  error_msg = '';

  loading: Boolean = false;
  form: FormGroup;
  colBig!: number;
  colXBig!: number;
  colMedium!: number;
  colSmall!: number;
  modalWidth!: string;
  payments: PaymentForm[] = [];
  total: string[] | number[] = [];
  change: string[] = [];
  created_pay: boolean = false;
  files: File[] = [];
  is_dollars: boolean = false;
  loadingExchangeRate: boolean = false;
  exchange_rate: number = 1;
  maxDate: Date;
  dateAux: Date = new Date();
  banks!: BankAccount[]
  protected _onDestroy = new Subject<void>();
  public banksCtrl: FormControl = new FormControl();
  public banksFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<BankAccount[]> = new ReplaySubject<BankAccount[]>(1);
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreatePaymentComponent>,
    private dialog: MatDialog,
    private _helpersService: FunctionsService,
    private breakpointObserver: BreakpointObserver,
    private _formBuider: FormBuilder,
    private _paymentService: PaymentService,
    private _toolsService: ToolService,
    private _bankAccountService: BankAccountService
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
    this.form = this._formBuider.group({
      cash: ['0.00'],
      payment_delivery: ['0.00'],
      check: ['0.00'],
      card: ['0.00'],
      transfer: ['0.00'],
      type_card: ['1'],
      client: ['CLIENTE DESCONOCIDO'],
      id_client: ['0'],
      attachmentTransfer: [''],
      attachmentCheck: [''],
      attachmentCard: [''],
      attachmentCash: [''],
      date_payment: ['', Validators.required],
    });
    this.maxDate = new Date();
    this.loadBanks()
  }

  changeAccount() {
    if (this.banksCtrl.value.type_account == 2) {
      if (this.is_dollars == false) {
        this.banksCtrl.reset()
        Swal.fire({
          title: 'ERROR',
          text: 'SELECCIONA PRIMERO EL PAGO EN DOLARES',
          icon: 'error',
          confirmButtonColor: '#58B1F7',
          heightAuto: false,
        });
      }
    }
  }

  setFields() {
    this.form.controls['cash'].setValue('0.00');
    this.form.controls['payment_delivery'].setValue('0.00');
    this.form.controls['check'].setValue('0.00');
    this.form.controls['transfer'].setValue('0.00');
    this.form.controls['card'].setValue('0.00');
    this.form.controls['type_card'].setValue('1');
    this.payments = [];
    this.calculateTotal();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  changeDate() {
    console.log('CAMBIO DE FECHA');
    if (this.is_dollars) {
      this.changeIsDollars(true);
    }
  }

  onFileSelected(event: any, type: number) {
    const file = event.target.files[0];
    if (type == 1) {
      this.files[0] = file;
    }
    if (type == 2) {
      this.files[1] = file;
    }
    if (type == 3) {
      this.files[2] = file;
    }
    if (type == 4) {
      this.files[3] = file;
    }
  }
  changeIsDollars(status: boolean) {
    this.banksCtrl.reset()
    if (this.form.value.date_payment != '') {
      if (status) {
        this.loadingExchangeRate = true;
        console.log(this.form.value.date_payment.toISOString().slice(0, 10));
        this.dateAux.setTime(this.form.value.date_payment.getTime());
        this.dateAux.setDate(this.form.value.date_payment.getDate());
        this._toolsService
          .getExchangeRateToDollarsByDate(
            this.dateAux.toISOString().slice(0, 10)
          )
          .subscribe({
            next: (resp) => {
              console.log(resp);
              this.exchange_rate = resp.value;
            },
            complete: () => {
              this.loadingExchangeRate = false;
              this.is_dollars = status;
            },
            error: (err) => {
              this.loadingExchangeRate = false;
              this.is_dollars = false;
              console.log(err);
              Swal.fire({
                title: 'ERROR',
                text: 'HUBO UN PROBLEMA AL OBTENER LA TASA DE CAMBIO',
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
          });
      } else {
        this.exchange_rate = 1;
        this.is_dollars = status;
      }
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'NECESITAS SELECCIONAR PRIMERO LA FECHA DE PAGO',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  calculateValors(value: number, exchange_rate: number) {
    if (this.banksCtrl.value != undefined) {
      if (this.banksCtrl.value.type_account == 1) {
        return value / exchange_rate
      } else {
        return value
      }
    } else {
      return 0
    }

  }

  openCatalogClients(): void {
    const dialogRef = this.dialog.open(CatalogClientsComponent, {
      disableClose: false,
      width: '100%',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != undefined) {
        this.form.controls['client'].setValue(result.name);
        this.form.controls['id_client'].setValue(result.id);
      }
    });
  }

  clearClient() {
    this.form.controls['id_client'].setValue(0);
    this.form.controls['client'].setValue('CLIENTE DESCONOCIDO');
  }

  createPayment() {
    if (!this.form.invalid) {
      if (Number(this.total[0]) > 0) {
        if (Number(this.form.value.cash)) {
          this.addPayToListPayments(
            this.form.value.cash,
            1,
            this.files[0],
            false
          );
        }
        if (Number(this.form.value.payment_delivery)) {
          this.addPayToListPayments(
            this.form.value.payment_delivery,
            2,
            this.files[1],
            false
          );
        }
        if (Number(this.form.value.check)) {
          this.addPayToListPayments(
            this.form.value.check,
            2,
            this.files[1],
            false
          );
        }
        if (Number(this.form.value.transfer)) {
          this.addPayToListPayments(
            this.form.value.transfer,
            3,
            this.files[2],
            false
          );
        }
        if (Number(this.form.value.card)) {
          this.addPayToListPayments(
            this.form.value.card,
            this.form.value.type_card == '1' ? 4 : 5,
            this.files[3],
            false
          );
        }
        if (this.payments.length) {
          if (this.banksCtrl.value != undefined) {
            this.loading = true;
            this._paymentService
              .create(
                this.payments,
                0,
                this.form.value.date_payment,
                this.is_dollars,
                this.exchange_rate,
                this.banksCtrl.value.id
              )
              .subscribe({
                next: (resp) => {
                  Swal.fire({
                    title: 'OK',
                    text: resp,
                    icon: 'success',
                    confirmButtonColor: '#58B1F7',
                    heightAuto: false,
                  });
                },
                complete: () => {
                  this.dataChange.emit(this.created_pay);
                  this.setFields();
                  this.loading = false;
                },
                error: (err) => {
                  Swal.fire({
                    title: 'ERROR',
                    text: err,
                    icon: 'error',
                    confirmButtonColor: '#58B1F7',
                    heightAuto: false,
                  });
                  this.setFields();
                  this.loading = false;
                },
              });
          } else {
            Swal.fire({
              title: 'ERROR',
              text: 'NO HAZ SELECCIONADO NINGUNA CUENTA',
              icon: 'error',
              confirmButtonColor: '#58B1F7',
              heightAuto: false,
            });
          }

        }
      } else {
        Swal.fire({
          title: 'ERROR',
          text: 'NO HAZ INGRESADO NINGUN PAGO',
          icon: 'error',
          confirmButtonColor: '#58B1F7',
          heightAuto: false,
        });
      }
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'LA FECHA ES INVALIDA',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      });
    }
  }

  addPayToListPayments(
    total: number,
    id_payment_method: number,
    attachment: File,
    is_attachment: boolean
  ) {
    const payment = {
      id_client: this.form.value.id_client,
      id_payment_method,
      total,
      attachment,
      is_attachment,
    };
    this.payments.push(payment);
  }

  calculateTotal() {
    this.total[0] =
      Number(this.form.value.cash) +
      Number(this.form.value.payment_delivery) +
      Number(this.form.value.card) +
      Number(this.form.value.transfer) +
      Number(this.form.value.check);
    this.total[1] = this._helpersService.numberToMXN(this.total[0]);
  }

  loadComponentSelectBanks() {
    this.filteredBanks.next(this.banks.slice());
    this.banksFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    let search = this.banksFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(
      this.banks.filter(banks => banks.bank.toLowerCase().indexOf(search) > -1)
    );
  }

  loadBanks() {

    this._bankAccountService.getAllData(false).subscribe({
      next: (resp) => {
        this.banks = resp
      },
      complete: () => {
        this.loadComponentSelectBanks()
        this.loading = false

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }

  ngOnInit(): void {
    this.calculateTotal();
  }
}
