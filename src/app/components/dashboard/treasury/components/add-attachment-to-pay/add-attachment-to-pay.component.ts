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
  selector: 'app-add-attachment-to-pay',
  templateUrl: './add-attachment-to-pay.component.html',
  styleUrls: ['./add-attachment-to-pay.component.scss']
})
export class AddAttachmentToPayComponent implements OnInit {
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  pathImageDefault: string = './assets/img/no-image.png'
  isChangeImage = false
  total_pay: number = 0
  error: boolean = false
  loading: boolean = false
  error_msg: string = ''
  colBig!: number;
  colMedium!: number;
  addPay: boolean = false
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();


  constructor(@Inject(MAT_DIALOG_DATA) public data: Payment, private _paymentService: PaymentService, private _userService: UserService, private breakpointObserver: BreakpointObserver, private dialogRef: MatDialogRef<AddAttachmentToPayComponent>) {
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

  }
  closeDialog() {
    this.dialogRef.close()
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
    }
  }

  createPaymentToClient() {
    if (this.image == null) {
      Swal.fire({ title: 'ERROR', text: 'NO HAZ CARGADO EL COMPROBATE', icon: 'error', heightAuto: false })
    } else {
      this.loading = true
      this._paymentService.addAttachmentToPayment(this.data.id, this.image, this.data.folio).subscribe({
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
