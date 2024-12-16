import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';

const clearFields = environment.clearFields

@Component({
  selector: 'app-create-list-price',
  templateUrl: './create-list-price.component.html',
  styleUrls: ['./create-list-price.component.scss']
})
export class CreateListPriceComponent implements OnInit {

  loading = true
  panelOpenState = false
  error = false
  error_msg = ''
  form: FormGroup
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  path: string = 'dashboard/list-prices'
  pathImageDefault: string = './assets/img/no-image.png'

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;


  protected _onDestroy = new Subject<void>();


  constructor(private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _listPriceService: ListPriceService, private _satService: SatService) {
    this._helpService.helpCreateProduct()
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
          this.colSmall = 12
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
      }
    });

    this.form = this._formBuider.group({
      id_company: [''],
      label: ['', Validators.required],
      description: ['', Validators.required],
      porcentage: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],

    })
  }


  cancel() {
    this._router.navigateByUrl(this.path)
  }

  clearFields() {
    if (clearFields) {
      this.form.reset({
        id_company: '',
        label: '',
        description: '',
        porcentage: '0'
      })
    }
  }

  create() {
    this.loading = true
    this.form.controls['id_company'].setValue(this._userService.user.id_company)
    this._listPriceService.create(this.form.value).subscribe({
      next: (resp) => {
        Swal.fire({
          title: 'AGREGAR LISTA DE PRECIOS',
          text: '¿DESEAS SEGUIR AGREGANDO LISTAS DE PRECIOS O REGRESAR AL LISTADO?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'CONTINUAR AGREGANDO',
          cancelButtonText: 'SALIR',
          confirmButtonColor: '#58B1F7',
          reverseButtons: true,
          heightAuto: false,
        }).then(result => {
          console.log(result)
          if (!result.isConfirmed) {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            this._router.navigateByUrl(this.path)
          } else {
            this.clearFields()
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          }
        })
      },
      error: (err) => {
        console.log(err.error)
        this.loading = false
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
      complete: () => {
        this.loading = false
      },
    })
  }

  ngOnInit(): void {
    this.error = this._userService.checkPermissionAdmin().error
    this.error_msg = this._userService.checkPermissionAdmin().message
    this.loading = false

  }
}
