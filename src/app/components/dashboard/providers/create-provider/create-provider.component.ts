import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Bank } from 'src/app/models/bank.model';
import { Contact } from 'src/app/models/contact.model';

import { Provider } from 'src/app/models/provider.model';
import { Tradename } from 'src/app/models/tradename';
import { environment } from 'src/environments/environment';
import { ProviderService } from 'src/app/services/provider.service';
import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

const clearFields = environment.clearFields

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent implements OnInit {
  loading = true
  displayedColumnsEmails: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  displayedColumnsTradenames: string[] = ['name', 'actions'];
  dataContacts!: MatTableDataSource<any>;
  dataTradenames!: MatTableDataSource<any>;
  form: FormGroup
  formContact: FormGroup
  formTradename!: FormGroup
  contacts: Contact[] = []
  tradenames: Tradename[] = []
  provider!: Provider
  colXBig!: number;
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  banks!: Bank[]
  public banksCtrl: FormControl = new FormControl();
  public banksFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();
  tradenameOnlyRead: BooleanInput = true
  rfcOnlyRead: BooleanInput = true
  minRFC: number = 12
  maxRFC: number = 13

  private _titlePage: string = 'PROVEEDOR'
  private _previousPath: string = 'dashboard/providers'

  constructor(private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _providerService: ProviderService, private _satService: SatService) {

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
          this.colXBig = 12
          this.colMedium = 12
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colXBig = 12
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colXBig = 12
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colXBig = 12
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colXBig = 12
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
      }
    });

    this.form = this._formBuider.group({
      representative: ['', Validators.required],
      name: ['', Validators.required],
      interbank_code: [''],
      account: [''],
      rfc: ['', [Validators.required, Validators.pattern(/[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(?:[A-Z\d]{3})/)]],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      comments: [''],
      credit_limit: ['0.00', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      credit_days: ['0', [Validators.pattern('^[0-9]*$'), Validators.required]],

    })
    this.formContact = this._formBuider.group({
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      name: ['', [Validators.required]],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      id_type_email: ['', [Validators.required]]
    })

    this.formTradename = this._formBuider.group({
      name: ['', Validators.required],
    })


  }
  cancel() {
    this._router.navigateByUrl(this._previousPath)
  }

  clearFields() {
    if (clearFields) {
      this.contacts = []
      this.tradenames = []
      this.dataContacts = new MatTableDataSource(this.contacts)
      this.dataTradenames = new MatTableDataSource(this.tradenames)
      this.banksCtrl.reset()
      this.form.reset({
        representative: '',
        name: '',
        interbank_code: '',
        account: '',
        rfc: '',
        telephone: '',
        email: '',
        comments: '',
        credit_limit: '0.00',
        credit_days: '0',
      })
    }
  }

  setObject() {
    console.log(this.banksCtrl)
    this.provider = new Provider(this.form.value.representative, this.form.value.name, this.form.value.rfc, this.form.value.email, this.form.value.telephone, this.form.value.comments, this.form.value.credit_limit, this.form.value.credit_days, this._userService.user.id_company, this.form.value.interbank_code, this.form.value.account, this.banksCtrl.value == null ? 0 : this.banksCtrl.value.id)
  }

  createRecord() {
    this.loading = true
    this.setObject()
    this._providerService.create(this.provider, this.contacts, this.tradenames).subscribe({
      next: (resp) => {
        Swal.fire({
          title: `AGREGAR ${this._titlePage}`,
          text: `¿DESEAS SEGUIR AGREGANDO  ${this._titlePage}ES O REGRESAR AL LISTADO?`,
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
            this.loading = false
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
            this._router.navigateByUrl(this._previousPath)
          } else {
            this.clearFields()
            this.loading = false
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          }
        })
      },
      error: (err) => {
        this.loading = false
        Swal.fire({
          title: 'ERROR', text: err.error.message, icon: 'error', heightAuto: false
        }
        )
      },
    })
  }




  createContact() {
    if (this.formContact.value.name != '') {
      this.contacts.push(this.formContact.value)
      this.dataContacts = new MatTableDataSource(this.contacts);
      this.formContact.controls['email'].setValue('')
      this.formContact.controls['telephone'].setValue('')
      this.formContact.controls['name'].setValue('')
    }

  }

  createTradename() {
    if (this.formTradename.value.name != '') {
      if (!this.tradenames.some(t => t.name === this.formTradename.value.name)) {
        this.tradenames.push(this.formTradename.value)
        this.dataTradenames = new MatTableDataSource(this.tradenames);
        this.formTradename.controls['name'].setValue('')
      } else {
        Swal.fire({ title: 'ERROR', text: 'YA EXISTE ESTE NOMBRE COMERCIAL', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      }
    }

  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1)
    this.dataContacts = new MatTableDataSource(this.contacts);
  }

  deleteTradename(index: number) {
    this.tradenames.splice(index, 1)
    this.dataTradenames = new MatTableDataSource(this.tradenames);
  }

  //BANKS
  loadBanks() {
    this._satService.getBanks().subscribe({
      next: (resp) => {
        this.banks = resp
      },
      complete: () => {
        this.loading = false
        this.loadComponentSelectBanks()
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
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
      this.banks.filter(banks => banks.name.toLowerCase().indexOf(search) > -1)
    );
  }


  changePropertiesFieldsBanks() {
    this.form.controls['account'].setValue('')
    this.form.controls['interbank_code'].setValue('')
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.loadBanks()
  }

}
