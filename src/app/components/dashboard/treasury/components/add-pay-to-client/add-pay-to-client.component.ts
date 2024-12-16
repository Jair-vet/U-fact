import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Client } from 'src/app/models/client.model';
import { Payment } from 'src/app/models/payment.model';
import { ClientService } from 'src/app/services/client.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pay-to-client',
  templateUrl: './add-pay-to-client.component.html',
  styleUrls: ['./add-pay-to-client.component.scss']
})
export class AddPayToClientComponent implements OnInit {
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  public imageName = ''
  pathImageDefault: string = './assets/img/pdf.png'
  isChangeImage = false
  total_pay: number = 0
  error: boolean = false
  loading: boolean = true
  error_msg: string = ''
  colBig!: number;
  colMedium!: number;
  addPay: boolean = false
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  clients!: Client[]
  public clientsCtrl: FormControl = new FormControl();
  public clientsFilterCtrl: FormControl = new FormControl();
  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Payment, private _paymentService: PaymentService, private _userService: UserService, private _clientService: ClientService, private dialogRef: MatDialogRef<AddPayToClientComponent>, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.colBig = 12
          this.colMedium = 12
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 3
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 12
          this.colMedium = 2
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 12
          this.colMedium = 2
        }
      }
    })
  }


  ngOnInit(): void {
    this.loadClients()
  }

  closeDialog() {
    this.dialogRef.close()
  }

  loadClients() {
    this._clientService.getClients(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.clients = resp
      },
      complete: () => {
        this.loadComponentSelectClients()
        this.loading = false
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadComponentSelectClients() {
    this.filteredClients.next(this.clients.slice());
    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });
  }

  protected setInitialValue() {
    this.filteredClients
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Client, b: Client) => a && b && a.id === b.id;
      });
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }
    let search = this.clientsFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clients.filter(client => client.name.toLowerCase().indexOf(search) > -1)
    );
  }

  changeImage(event: any): any {
    const file = event.target.files[0];
    this.image = file;

    if (!file) {
      this.imageTemp = this.pathImageDefault;
      this.isChangeImage = false
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.isChangeImage = true
    reader.onloadend = () => {
      this.imageTemp = reader.result;
      this.imageName = this.image.name
    }
  }

  createPaymentToClient() {
    if (this.clientsCtrl.status == 'INVALID') {
      Swal.fire({ title: 'ERROR', text: 'NO HAZ CARGADO EL COMPROBATE O NO HAZ SELECCIONADO UN CLIENTE', icon: 'error', heightAuto: false })
    } else {
      this.loading = true
      this._paymentService.addPaymentToClient(this.clientsCtrl.value.id, this.data.id, this.image, this.data.folio).subscribe({
        next: (resp) => {
          console.log(resp)
          Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.dataChange.emit(this.addPay);
          this.loading = false
        },
        error: (err) => {
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          this.loading = false
        },
      })
    }
  }

}
