import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

import { Client } from 'src/app/models/client.model';
import { Contact } from 'src/app/models/contact.model';
import { ListPrice } from 'src/app/models/list-price.model';


import { Municipality, State, Suburb } from 'src/app/models/location.model';
import { TaxRegimen } from 'src/app/models/sat.model';
import { User } from 'src/app/models/user.model';
import { ClientService } from 'src/app/services/client.service';
import { ContactService } from 'src/app/services/contact.service';
import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';
import { RoutingService } from 'src/app/services/routing.service';

import { SatService } from 'src/app/services/sat.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {

  displayedColumnsContacts: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  dataContacts!: MatTableDataSource<any>;

  loading: Boolean = false
  error: Boolean = false
  loadingContacts: Boolean = false
  client!: Client
  idClient: string = '0'
  form: FormGroup

  formContact: FormGroup
  error_msg: String = ''
  contacts: Contact[] = []

  tax_regimes!: TaxRegimen[]


  listPrices!: ListPrice[]
  public listPricesCtrl: FormControl = new FormControl();
  public listPricesFilterCtrl: FormControl = new FormControl();
  public filteredListPrices: ReplaySubject<ListPrice[]> = new ReplaySubject<ListPrice[]>(1);


  states!: State[]
  public statesCtrl: FormControl = new FormControl();
  public statesFilterCtrl: FormControl = new FormControl();
  public filteredStates: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);


  municipalities!: Municipality[]
  public municipalitiesCtrl: FormControl = new FormControl();
  public municipalitiesFilterCtrl: FormControl = new FormControl();
  public filteredMunicipalities: ReplaySubject<Municipality[]> = new ReplaySubject<Municipality[]>(1);


  suburbs!: Suburb[]
  public suburbsCtrl: FormControl = new FormControl();
  public suburbsFilterCtrl: FormControl = new FormControl();
  public filteredSuburbs: ReplaySubject<Suburb[]> = new ReplaySubject<Suburb[]>(1);


  waitValidatePostalCode: BooleanInput = false

  public taxRegimesCtrl: FormControl = new FormControl();
  public taxRegimesFilterCtrl: FormControl = new FormControl();
  public filteredTaxRegimes: ReplaySubject<TaxRegimen[]> = new ReplaySubject<TaxRegimen[]>(1);

  public users!: User[]
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();
  tradenameOnlyRead: BooleanInput = true
  rfcOnlyRead: BooleanInput = true
  minRFC: number = 10
  maxRFC: number = 10
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  private _typeContact: string = 'client'
  dataSource!: MatTableDataSource<any>;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _routingService: RoutingService, private _listPriceService: ListPriceService, private _contactService: ContactService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _clientService: ClientService, private _satService: SatService) {

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

      name: ['', Validators.required],
      tradename: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(/[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(?:[A-Z\d]{3})/)]],
      postal_code: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(5), Validators.maxLength(5)]],
      address: ['', Validators.required],
      num_ext: ['', Validators.required],
      num_int: [''],
      comments: [''],
      credit_limit: ['0.00', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      credit_days: ['0', [Validators.pattern('^[0-9]*$'), Validators.required]],
      representative: ['', Validators.required],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],

    })

    this.formContact = this._formBuider.group({
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      name: ['', [Validators.required]],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      id_record: [''],
      id_type_email: ['', [Validators.required]]

    })

    this.idClient = this._route.snapshot.paramMap.get('id') || '0'
    this._routingService.setRouting(`dashboard/clients/edit-client/${this.idClient}`, `dashboard/clients`)

  }

  ngAfterViewInit() {


  }
  ngOnInit(): void {
    this.loadTaxRegimes()
  }



  loadDataPostalCode() {


    this._clientService.validatePostalCode(this.client.postal_code!).subscribe({
      next: (resp) => {
        this.states = resp.state
        this.municipalities = resp.municipality
        this.suburbs = resp.suburb
      },
      complete: () => {
        this.loadComponentSelectStates()
        this.loadComponentSelectMunicipalities()
        this.loadComponentSelectSuburbs()
        this.loadContacts(true)


      },
      error: (err) => {

        console.log(err)
      },

    })
  }



  validatePostalCode() {
    console.log(this.form.value.postal_code)
    if (this.form.value.postal_code.length == 5) {
      this.waitValidatePostalCode = true
      this._clientService.validatePostalCode(this.form.value.postal_code).subscribe({
        next: (resp) => {
          this.states = resp.state
          this.municipalities = resp.municipality
          this.suburbs = resp.suburb
        },
        error: (err) => {
          this.waitValidatePostalCode = false
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.waitValidatePostalCode = false

          this.loadComponentSelectStates()
          this.loadComponentSelectMunicipalities()
          this.loadComponentSelectSuburbs()
        },
      })

    } else {

    }
  }

  createContact() {



    this.loadingContacts = true
    this.formContact.value.id_record = this.idClient


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
        Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR AL INTENTAR ELIMINAR EL CONTACTO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },

    })


  }
  loadContacts(isFirst: boolean) {
    this._contactService.getContacts(this.idClient.toString(), this._typeContact).subscribe({
      next: (resp) => {
        this.dataContacts = new MatTableDataSource(resp);

        this.contacts = resp
        this.loadingContacts = false

      },
      complete: () => {
        if (isFirst) {
          this.setFields()
        }
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }


  loadData() {
    this._clientService.getClient(this.idClient.toString()).subscribe({
      next: (resp) => {
        this.client = resp
      },
      complete: () => {
        this.loadDataPostalCode()
      },
      error: (err) => {

        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },

    })

  }

  setStateAndMunicipality() {
    this.statesCtrl.setValue(this.states[0])
    this.municipalitiesCtrl.setValue(this.municipalities[0])
  }


  cancel() {
    this._router.navigateByUrl(this._routingService.previousRoute)
  }
  updateClient() {
    this.loading = true
    if ((this.taxRegimesCtrl.value == null || this.userCtrl.value == null || this.listPricesCtrl.value == null || this.suburbsCtrl == null)) {
      Swal.fire({
        title: 'ERROR', text: 'FALTAN CAMPOS POR LLENAR', icon: 'error', heightAuto: false
      }
      )
      this.loading = false

    } else {
      this._clientService.updateClient(this.form.value.name, this.form.value.tradename, this.form.value.rfc, this.form.value.representative, this.statesCtrl.value == undefined ? '' : this.statesCtrl.value.state, this.municipalitiesCtrl.value == undefined ? '' : this.municipalitiesCtrl.value.municipality, this.suburbsCtrl.value == undefined ? '' : this.suburbsCtrl.value.suburb, this.form.value.postal_code, this.form.value.address, this.form.value.num_ext, this.form.value.num_int, this.form.value.telephone, this.form.value.email, this._userService.user.id_company.toString(), this.taxRegimesCtrl.value.id.toString(), this.listPricesCtrl.value.id.toString(), this.userCtrl.value.id.toString(), this.client.id.toString(), this.form.value.comments, this.form.value.credit_limit, this.form.value.credit_days, 2).subscribe({
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
          this._router.navigateByUrl('dashboard/clients')
        },

      })
    }
  }

  isValidSelect() {
    this.form.controls['rfc'].setValue('')
    this.setVariableValues()

  }

  setVariableValues() {
    if (this.taxRegimesCtrl.value.id) {

      this.rfcOnlyRead = false

      if (this.taxRegimesCtrl.value.fisica == 'SI' && this.taxRegimesCtrl.value.moral == 'SI') {
        this.minRFC = 12
        this.maxRFC = 13
      }
      else if (this.taxRegimesCtrl.value.fisica == 'SI') {
        this.minRFC = 13
        this.maxRFC = 13
      } else {
        this.minRFC = 12
        this.maxRFC = 12
      }
    } else {
      this.rfcOnlyRead = true
    }
  }

  setFields() {
    this.statesCtrl.setValue(this.states.filter(x => x.state == this.client.state)[0])
    this.municipalitiesCtrl.setValue(this.municipalities.filter(x => x.municipality == this.client.municipality)[0])

    this.suburbsCtrl.setValue(this.suburbs.filter(x => x.suburb === this.client.city)[0])


    this.form.controls['name'].setValue(this.client.name);
    this.form.controls['rfc'].setValue(this.client.rfc);
    this.form.controls['tradename'].setValue(this.client.tradename)
    this.form.controls['representative'].setValue(this.client.representative)

    this.form.controls['postal_code'].setValue(this.client.postal_code)
    this.form.controls['address'].setValue(this.client.address)
    this.form.controls['num_ext'].setValue(this.client.num_ext)
    this.form.controls['num_int'].setValue(this.client.num_int)
    this.form.controls['telephone'].setValue(this.client.telephone)
    this.form.controls['email'].setValue(this.client.email)
    this.form.controls['comments'].setValue(this.client.comments)
    this.form.controls['credit_limit'].setValue(this.client.credit_limit)
    this.form.controls['credit_days'].setValue(this.client.credit_days)
    this.taxRegimesCtrl.setValue(this.tax_regimes[this.client.id_regime! - 1])

    this.listPricesCtrl.setValue(this.listPrices.filter(x => x.id == this.client.id_type_price)[0])
    this.userCtrl.setValue(this.users.filter(x => x.id == this.client.id_seller)[0])
    this.setVariableValues()
    this.loading = false
  }

  //STATES
  loadComponentSelectStates() {
    this.filteredStates.next(this.states.slice());
    this.statesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStates();
      });
  }

  protected filterStates() {
    if (!this.states) {
      return;
    }
    let search = this.statesFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStates.next(
      this.states.filter(states => states.state.toLowerCase().indexOf(search) > -1)
    );
  }


  //MUNICIPALITES
  loadComponentSelectMunicipalities() {
    this.filteredMunicipalities.next(this.municipalities.slice());
    this.municipalitiesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMunicipalities();
      });
  }

  protected filterMunicipalities() {
    if (!this.municipalities) {
      return;
    }
    let search = this.municipalitiesFilterCtrl.value;
    if (!search) {
      this.filteredMunicipalities.next(this.municipalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMunicipalities.next(
      this.municipalities.filter(municipalities => municipalities.municipality.toLowerCase().indexOf(search) > -1)
    );
  }


  //SUBURB
  loadComponentSelectSuburbs() {
    this.filteredSuburbs.next(this.suburbs.slice());
    this.municipalitiesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMunicipalities();
      });
  }

  protected filterSuburbs() {
    if (!this.suburbs) {
      return;
    }
    let search = this.suburbsFilterCtrl.value;
    if (!search) {
      this.filteredSuburbs.next(this.suburbs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSuburbs.next(
      this.suburbs.filter(suburbs => suburbs.suburb.toLowerCase().indexOf(search) > -1)
    );
  }


  loadListPrices() {

    this._listPriceService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.listPrices = resp
        console.log(this.listPrices)
      },
      complete: () => {
        this.loadComponentSelectListPrices()
        this.loadUsers()
      },
      error: (err) => {
        console.log(err)
      },

    })
  }

  loadTaxRegimes() {

    this.loading = true
    this._satService.getTaxRegimen(0).subscribe({
      next: (resp) => {
        this.tax_regimes = resp
      },
      complete: () => {
        this.loadComponentSelectTaxRegimes()
        this.loadListPrices()


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


  loadComponentSelectTaxRegimes() {
    this.filteredTaxRegimes.next(this.tax_regimes.slice());
    this.taxRegimesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTaxRegimes();
      });
  }

  //LIST PRICES
  loadComponentSelectListPrices() {
    this.filteredListPrices.next(this.listPrices.slice());
    this.listPricesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterListPrices();
      });
  }

  protected filterListPrices() {
    if (!this.listPrices) {
      return;
    }
    let search = this.listPricesFilterCtrl.value;
    if (!search) {
      this.filteredListPrices.next(this.listPrices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredListPrices.next(
      this.listPrices.filter(listPrices => listPrices.label.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterTaxRegimes() {
    if (!this.tax_regimes) {
      return;
    }
    let search = this.taxRegimesFilterCtrl.value;
    if (!search) {
      this.filteredTaxRegimes.next(this.tax_regimes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTaxRegimes.next(
      this.tax_regimes.filter(tax_regimes => tax_regimes.description.toLowerCase().indexOf(search) > -1)
    );
  }

  //COMPONENT SELLER


  loadUsers() {
    this._userService.getSellers(this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.users = resp
      },
      complete: () => {

        this.loadData()
        this.loadComponentSelectUser()
      },
      error: (err) => {

        this.error = true
        this.error_msg = err.error.message
        this.loading = false

      },
    })
  }

  protected filterUser() {
    if (!this.users) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUser.next(this.users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUser.next(
      this.users.filter(users => users.name.toLowerCase().indexOf(search) > -1)
    );
  }


  loadComponentSelectUser() {
    this.filteredUser.next(this.users.slice());
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUser();
      });
  }

}
