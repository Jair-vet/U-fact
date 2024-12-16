import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Bank } from 'src/app/models/bank.model';
import { Contact } from 'src/app/models/contact.model';


import { Provider } from 'src/app/models/provider.model';
import { Tradename } from 'src/app/models/tradename';
import { ContactService } from 'src/app/services/contact.service';
import { HelpService } from 'src/app/services/help.service';
import { ProviderService } from 'src/app/services/provider.service';
import { SatService } from 'src/app/services/sat.service';
import { TradenameService } from 'src/app/services/tradename.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss']
})
export class EditProviderComponent implements OnInit {

  displayedColumnsContacts: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  dataContacts!: MatTableDataSource<any>;
  displayedColumnsTradenames: string[] = ['name', 'actions'];
  dataTradenames!: MatTableDataSource<any>;

  loading: Boolean = true
  error: Boolean = false
  loadingContacts: Boolean = false
  loadingTradenames: Boolean = false
  provider!: Provider
  idProvider: string = '0'
  form: FormGroup
  formContact: FormGroup
  formTradename: FormGroup
  error_msg: String = ''
  contacts: Contact[] = []
  tradenames: Tradename[] = []
  banks!: Bank[]
  public banksCtrl: FormControl = new FormControl();
  public banksFilterCtrl: FormControl = new FormControl();
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  rfcOnlyRead: BooleanInput = true
  minRFC: number = 12
  maxRFC: number = 13
  colBig!: number;
  colMedium!: number;
  colSmall!: number;

  private _typeContact: string = 'provider'


  constructor(private _tradenameService: TradenameService, private _contactService: ContactService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _providerService: ProviderService, private _satService: SatService) {

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
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 6
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 6
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
      representative: ['', Validators.required],
      name: ['', Validators.required],
      interbank_code: [''],
      account: [''],
      rfc: ['', [Validators.required, Validators.pattern(/[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(?:[A-Z\d]{3})/)]],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      comments: ['',],
      credit_limit: ['0.00', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      credit_days: ['0', [Validators.pattern('^[0-9]*$'), Validators.required]],

    })
    this.formTradename = this._formBuider.group({
      name: ['', Validators.required],
      id_provider: [''],
      id_company: [''],
    })

    this.formContact = this._formBuider.group({
      name: ['', Validators.required],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      id_record: [''],
      id_type_email: ['', [Validators.required]]

    })

    this.idProvider = this._route.snapshot.paramMap.get('id') || '0'

  }

  ngAfterViewInit() {


  }
  ngOnInit(): void {
    this.loadData()
  }


  createContact() {

    this.loadingContacts = true
    this.formContact.value.id_record = this.idProvider


    this._contactService.addContact(this.formContact.value, this._typeContact).subscribe({
      next: (resp) => {
        if (!resp.ok) {

          Swal.fire({ title: 'ERROR', text: resp.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        } else {
          this.formContact.controls['email'].setValue('')
          this.formContact.controls['name'].setValue('')
          this.formContact.controls['telephone'].setValue('')

        }
      },
      error: (err) => {
        console.log(err)
        Swal.fire({ title: 'ERROR', text: err.errors.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        this.loadingContacts = false
      },
      complete: () => {
        this.loadContacts(false)
      },
    })
  }


  createTradename() {
    if (this.formTradename.value.name != '') {
      if (!this.tradenames.some(t => t.name === this.formTradename.value.name)) {
        this.loadingTradenames = true
        this.formTradename.value.id_provider = this.idProvider
        this.formTradename.value.id_company = this._userService.user.id_company
        this._tradenameService.addTradename(this.formTradename.value).subscribe({
          next: (resp) => {
            if (!resp.ok) {
              Swal.fire({ title: 'ERROR', text: resp.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
            } else {
              this.formTradename.controls['name'].setValue('')
            }
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: err.errors.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
            this.loadingTradenames = false
          },
          complete: () => {
            this.loadTradenames(false)
          },
        })
      } else {
        Swal.fire({ title: 'ERROR', text: 'YA EXISTE ESTE NOMBRE COMERCIAL', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      }
    }
  }

  deleteContact(id: number) {
    this.loadingContacts = true
    this._contactService.deleteContact(id.toString(), this._typeContact).subscribe({
      next: (resp) => {
        if (!resp.ok) {
          Swal.fire({ title: 'ERROR', text: resp.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      },
      complete: () => {
        this.loadContacts(false);
      },
      error: (err) => {
        this.loadingContacts = false
        console.log(err)
        Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR AL INTENTAR ELIMINAR EL EMAIL', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
    })
  }

  deleteTradename(id: number) {
    this.loadingTradenames = true
    this._tradenameService.deleteTradename(id.toString()).subscribe({
      next: (resp) => {
        if (!resp.ok) {
          Swal.fire({ title: 'ERROR', text: resp.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      },
      complete: () => {
        this.loadTradenames(false);
      },
      error: (err) => {
        this.loadingTradenames = false
        console.log(err)
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
    })
  }

  loadContacts(isFirst: boolean) {
    this._contactService.getContacts(this.idProvider.toString(), this._typeContact).subscribe({
      next: (resp) => {
        this.dataContacts = new MatTableDataSource(resp);
        this.contacts = resp
        this.loadingContacts = false
      },
      complete: () => {
        if (isFirst) {
          this.loadTradenames(isFirst)
        }
      },
      error: (err) => {
        this.loadingContacts = false
        this.loading = false
        console.log(err)
      },
    })
  }

  loadTradenames(isFirst: boolean) {
    this._tradenameService.getTradenames(this.idProvider.toString()).subscribe({
      next: (resp) => {
        this.dataTradenames = new MatTableDataSource(resp);
        this.tradenames = resp
        this.loadingTradenames = false
      },
      complete: () => {
        if (isFirst) {
          this.loadBanks()

        }
      },
      error: (err) => {
        this.loadingTradenames = false
        this.loading = false
      },
    })
  }


  loadData() {
    this._providerService.getData(this.idProvider.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.provider = resp
      },
      complete: () => {
        this.loadContacts(true)
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })
  }



  cancel() {
    this._router.navigateByUrl('dashboard/providers')
  }


  updateRecord() {
    this.loading = true
    this.setObject()
    this._providerService.update(this.provider).subscribe({
      next: (resp) => {
        Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
      error: (err) => {
        console.log(err)
        this.loading = false
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
      complete: () => {
        this.loading = false
        this._router.navigateByUrl('dashboard/providers')
      },

    })
  }

  setObject() {
    this.provider.representative = this.form.value.representative
    this.provider.comments = this.form.value.comments
    this.provider.credit_days = this.form.value.credit_days
    this.provider.credit_limit = this.form.value.credit_limit
    this.provider.email = this.form.value.email
    this.provider.name = this.form.value.name
    this.provider.rfc = this.form.value.rfc
    this.provider.telephone = this.form.value.telephone
    this.provider.interbank_code = this.form.value.interbank_code
    this.provider.account = this.form.value.account
    this.provider.id_bank = this.banksCtrl.value == null ? 0 : this.banksCtrl.value.id
  }

  setFields() {
    if (this.provider.id_bank != 0) {
      this.banksCtrl.setValue(this.banks.filter(x => x.id == this.provider.id_bank)[0])

    }
    this.form.controls['representative'].setValue(this.provider.representative.toString())
    this.form.controls['name'].setValue(this.provider.name)
    this.form.controls['rfc'].setValue(this.provider.rfc)
    this.form.controls['telephone'].setValue(this.provider.telephone)
    this.form.controls['email'].setValue(this.provider.email)
    this.form.controls['credit_limit'].setValue(this.provider.credit_limit)
    this.form.controls['credit_days'].setValue(this.provider.credit_days)
    this.form.controls['comments'].setValue(this.provider.comments)
    this.form.controls['interbank_code'].setValue(this.provider.interbank_code)
    this.form.controls['account'].setValue(this.provider.account)
    this.loading = false
  }


  loadBanks() {
    this._satService.getBanks().subscribe({
      next: (resp) => {
        this.banks = resp
      },
      complete: () => {
        this.setFields()
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

  }




}
