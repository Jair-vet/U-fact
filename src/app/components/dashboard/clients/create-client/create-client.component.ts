import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { CodeCountry } from 'src/app/models/code-country.model';
import { Contact } from 'src/app/models/contact.model';
import { ListPrice } from 'src/app/models/list-price.model';

import { Municipality, State, Suburb } from 'src/app/models/location.model';
import { Residence } from 'src/app/models/residence.model';
import { TaxRegimen } from 'src/app/models/sat.model';
import { User } from 'src/app/models/user.model';
import { CatalogService } from 'src/app/services/catalogs.service';
import { ClientService } from 'src/app/services/client.service';
import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';
import { SatService } from 'src/app/services/sat.service';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PriceProductsComponent } from '../components/price-list-component/price-list-component';
import { ListRequestProduct } from 'src/app/models/list-request-product.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


const clearFields = environment.clearFields

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  loading = true
  error: boolean = false
  error_msg: string = ''
  loadingContacts = false
  modalWidth: string = '';
  products: any[] = [];
  inactive: boolean = false
  displayedColumnsContacts: string[] = ['name', 'email', 'telephone', 'type', 'actions'];
  dataContacts!: MatTableDataSource<any>;
  selectedProductsDataSource = new MatTableDataSource<ListRequestProduct>();
  form: FormGroup
  formContact: FormGroup
  contacts: Contact[] = []
  residences: Residence[] = []
  isDisabled: boolean = false;

  code_countries!: CodeCountry[] 
  public codeCountryCtrl: FormControl = new FormControl();
  public codeCountryFilterCtrl: FormControl = new FormControl();
  public filteredCodeCountry: ReplaySubject<CodeCountry[]> = new ReplaySubject<CodeCountry[]>(1);

  tax_regimes!: TaxRegimen[] 
  public taxRegimesCtrl: FormControl = new FormControl();
  public taxRegimesFilterCtrl: FormControl = new FormControl();
  public filteredTaxRegimes: ReplaySubject<TaxRegimen[]> = new ReplaySubject<TaxRegimen[]>(1);

  states!: State[]
  public statesCtrl: FormControl = new FormControl();
  public statesFilterCtrl: FormControl = new FormControl();
  public filteredStates: ReplaySubject<State[]> = new ReplaySubject<State[]>(1);

  listPrices: ListPrice[] = [];
  public listPricesCtrl: FormControl = new FormControl();
  public listPricesFilterCtrl: FormControl = new FormControl();
  public filteredListPrices: ReplaySubject<ListPrice[]> = new ReplaySubject<ListPrice[]>(1);
  displayedSelectedColumns: string[] = ['id', 'label', 'description', 'porcentage', 'actions'];
  dataProducts!: MatTableDataSource<any>;

  municipalities!: Municipality[]
  public municipalitiesCtrl: FormControl = new FormControl();
  public municipalitiesFilterCtrl: FormControl = new FormControl();
  public filteredMunicipalities: ReplaySubject<Municipality[]> = new ReplaySubject<Municipality[]>(1);


  suburbs!: Suburb[]
  public suburbsCtrl: FormControl = new FormControl();
  public suburbsFilterCtrl: FormControl = new FormControl();
  public filteredSuburbs: ReplaySubject<Suburb[]> = new ReplaySubject<Suburb[]>(1);

  users!: User[]
  public userCtrl: FormControl = new FormControl();
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  waitValidatePostalCode: BooleanInput = false
  colBig!: number;
  colMedium!: number;
  colSmall!: number;


  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  @Inject(MAT_DIALOG_DATA) public data: any

  protected _onDestroy = new Subject<void>();
  tradenameOnlyRead: BooleanInput = true
  // rfcOnlyRead: BooleanInput = true
  minRFC: number = 10
  maxRFC: number = 10

  constructor(
    private _listPriceService: ListPriceService, 
    private _helpService: HelpService, 
    private breakpointObserver: BreakpointObserver, 
    private _formBuider: FormBuilder, 
    private _router: Router, 
    private _userService: UserService, 
    private _clientService: ClientService, 
    private _satService: SatService, 
    private _uploadService: UploadService,
    private _catalogService: CatalogService,
    private dialog: MatDialog,
    private fb: FormBuilder, 
    
  ) {
    this._helpService.helpCreateClient()
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
          this.colSmall = 4
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
      // tradename: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(/[A-ZÑ&]{3,4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(?:[A-Z\d]{3})/)]],
      address: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(5), Validators.maxLength(5)]],
      id_tax: [''],
      state: [''],
      num_ext: ['', Validators.required],
      num_int: ['',],
      comments: [''],
      credit_limit: ['', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
      credit_days: ['', [Validators.pattern('^[0-9]*$'), Validators.required]],
      representative: ['', Validators.required],
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      id_residence: ['', Validators.required],
      country_code: ['MXN', Validators.required],
      address_complete: ['']
    })
    this.formContact = this._formBuider.group({
      email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      name: ['', [Validators.required]],
      telephone: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      id_type_email: ['', [Validators.required]]
    })

  }
  cancel() {
    this._router.navigateByUrl('dashboard/clients')
  }

  onResidenceChange() {

    if (this.form.value.id_residence !== 1) {
      this.form.controls['rfc'].setValue('XEXX010101000');
      this.form.controls['rfc'].disable();
      this.form.controls['country_code'].setValue('USA');
      this.codeCountryCtrl.setValue(this.code_countries[69])
      this.codeCountryCtrl.enable()
      this.taxRegimesCtrl.setValue(this.tax_regimes.find(regime => regime.id === 11))
      this.suburbsCtrl.reset()
      this.municipalitiesCtrl.reset()
      this.statesCtrl.reset()
      this.form.get('id_tax')!.setValidators([Validators.required]);
      this.form.get('state')!.setValidators([Validators.required]);
      this.form.get('address_complete')!.setValidators([Validators.required]);

    } else {
      if (this.form.value.rfc === 'XEXX010101000')
        this.form.controls['rfc'].setValue('');

      this.form.controls['country_code'].setValue('MXN');
      this.codeCountryCtrl.setValue(this.code_countries[141])
      this.codeCountryCtrl.disable()

    }

    this.form.controls['rfc'].enable();

  }

  validatePostalCode() {

    if (this.form.value.postal_code.length == 5 && this.form.value.id_residence !== 2) {
      this.waitValidatePostalCode = true
      this._clientService.validatePostalCode(this.form.value.postal_code).subscribe({
        next: (resp) => {
          this.states = resp.state
          this.municipalities = resp.municipality
          this.suburbs = resp.suburb
        },
        error: (err) => {
          this.waitValidatePostalCode = false
          Swal.fire({ title: 'Error', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.waitValidatePostalCode = false

          this.loadComponentSelectStates()
          this.loadComponentSelectMunicipalities()
          this.loadComponentSelectSuburbs()
        },
      })

    }
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = { selectProducts: [] }; 
    }
    this.loadData();
    this.loadResidences();
  }

  validateClient(): boolean {
    if (this.form.value.id_residence === 1) {
      return (this.taxRegimesCtrl.value == null || /* this.userCtrl.value == null || */ this.suburbsCtrl == null)
    } else if (this.form.value.id_residence === 2) {
      return (this.listPricesCtrl.value == null)
    }
    return false
  }

  createClient() {
    this.loading = true

    if (this.validateClient()) {
      Swal.fire({
        title: 'ERROR', text: 'FALTAN CAMPOS POR LLENAR', icon: 'error', heightAuto: false
      }
      )
      this.loading = false

    } else {
      const selectedProducts = this.products.filter(product => product.isSelected);

      console.log('Productos seleccionados enviados:', selectedProducts);

      console.log( this.form.value.name,
        this.form.value.tradename,
        this.form.value.rfc,
        this.form.value.representative,
        this.form.value.id_residence === 1 ? this.statesCtrl.value : this.form.value.state,
        this.form.value.id_residence === 1 ? this.municipalitiesCtrl.value.municipality : '',
        this.form.value.id_residence === 1 ? this.suburbsCtrl.value.suburb : '',
        this.form.value.postal_code,
        this.form.value.address,
        this.form.value.num_ext,
        this.form.value.num_int,
        this.form.value.telephone,
        this.form.value.email,
        this._userService.user.id_company.toString(),
        this.taxRegimesCtrl.value.id.toString(),
        // this.userCtrl.value.id.toString(),
        this.form.value.comments,
        this.form.value.credit_limit,
        this.form.value.credit_days,
        this.form.value.id_residence,
        this.contacts,
        this.form.value.id_tax,
        this.form.value.country_code,
        this.form.value.address_complete,
        selectedProducts );
      
      this._clientService.createClient(
        this.form.value.name,
        this.form.value.tradename,
        this.form.value.rfc,
        this.form.value.representative,
        this.form.value.id_residence === 1 ? this.statesCtrl.value : this.form.value.state,
        this.form.value.id_residence === 1 ? this.municipalitiesCtrl.value.municipality : '',
        this.form.value.id_residence === 1 ? this.suburbsCtrl.value.suburb : '',
        this.form.value.postal_code,
        this.form.value.address,
        this.form.value.num_ext,
        this.form.value.num_int,
        this.form.value.telephone,
        this.form.value.email,
        this._userService.user.id_company.toString(),
        this.taxRegimesCtrl.value.id.toString(),
        // this.userCtrl.value.id.toString(),
        this.form.value.comments,
        this.form.value.credit_limit,
        this.form.value.credit_days,
        this.form.value.id_residence,
        this.contacts,
        this.form.value.id_tax,
        this.form.value.country_code,
        this.form.value.address_complete,
        selectedProducts 
      ).subscribe({
          next: (resp) => {
            Swal.fire({
              title: 'AGREGAR CLIENTE',
              text: '¿DESEAS SEGUIR AGREGANDO CLIENTES O REGRESAR AL LISTADO?',
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
                this._router.navigateByUrl('dashboard/clients')

              } else {
                this.loading = false
                this.clearFields()
                Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
              }
            })
          },
          error: (err) => {
            console.log(err)
            this.loading = false
            Swal.fire({
              title: 'ERROR', text: err.error.message, icon: 'error', heightAuto: false
            }
            )
          },

        })
    }
  }

  setStateAndMunicipality() {
    this.statesCtrl.setValue(this.states[0])
    this.municipalitiesCtrl.setValue(this.municipalities[0])
  }


  // TODO:
  clearFields() {
    if (clearFields) {
      this.form.reset({
        name: '',
        tradename: '',
        rfc: '',
        postal_code: '',
        address: '',
        num_ext: '',
        num_int: '',
        comments: '',
        credit_limit: '0.00',
        credit_days: '0',
        representative: '',
        email: '',
        telephone: '',
        id_residence: '1',
        country_code: 'MXN',
        address_complete: ''
      })
      this.contacts = []
      this.dataContacts = new MatTableDataSource(this.contacts);
      this.taxRegimesCtrl.reset()
      this.suburbsCtrl.reset()
      this.municipalitiesCtrl.reset()
      this.statesCtrl.reset()
      this.listPricesCtrl.reset()
      // this.userCtrl.reset()
      this.products = [];
      this.loadProducts()
    }
  }


  // isValidSelect() {
  //   this.form.controls['rfc'].setValue('')
  //   if (this.taxRegimesCtrl.value.id) {
  //     this.rfcOnlyRead = false
  //     if (this.taxRegimesCtrl.value.fisica == 'SI' && this.taxRegimesCtrl.value.moral == 'SI') {
  //       this.minRFC = 12
  //       this.maxRFC = 13
  //     }
  //     else if (this.taxRegimesCtrl.value.fisica == 'SI') {
  //       this.minRFC = 13
  //       this.maxRFC = 13
  //     } else {
  //       this.minRFC = 12
  //       this.maxRFC = 12
  //     }
  //   } else {
  //     this.rfcOnlyRead = true
  //   }
  // }

  createContact() {
    if (this.formContact.value.email != '' && this.formContact.value.telephone != '' && this.formContact.value.name != '') {
      this.contacts.push(this.formContact.value)
      this.dataContacts = new MatTableDataSource(this.contacts);
      this.formContact.controls['email'].setValue('')
      this.formContact.controls['telephone'].setValue('')
      this.formContact.controls['name'].setValue('')
    }
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1)
    this.dataContacts = new MatTableDataSource(this.contacts);
  }

  loadTaxRegimes() {
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

  loadListPrices() {
    this._listPriceService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
      next: (resp) => {
        this.listPrices = resp
        // console.log(this.listPrices)
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


  protected setInitialValue() {
    this.filteredTaxRegimes
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: TaxRegimen, b: TaxRegimen) => a && b && a.id === b.id;
      });
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

  //COMPONENT SELLER


  loadUsers() {
    this._userService.getSellers(this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.users = resp
      },
      complete: () => {
        this.loadCodeCountries()
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

  loadResidences() {
    this._catalogService.getResidences().subscribe({
      next: (resp) => {
        this.residences = resp
      },
      complete: () => {
        this.loadTaxRegimes()
      },
      error: (err) => {

        this.error = true
        this.error_msg = err.error.message
        this.loading = false

      },
    })
  }

  loadComponentSelectUser() {
    this.filteredUser.next(this.users.slice());
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUser();
      });
  }

  //CARGAR COUNTRY CODE
  setCountryCode() {
    this.form.controls['country_code'].setValue(
      this.codeCountryCtrl.value.code
    );
  }


  protected filterCodeCountry() {
    if (!this.code_countries) {
      return;
    }
    let search = this.codeCountryFilterCtrl.value;
    if (!search) {
      this.filteredCodeCountry.next(this.code_countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCodeCountry.next(
      this.code_countries.filter(
        (code_countries) =>
          code_countries.code.toLowerCase().indexOf(search) > -1
      )
    );
  }

  loadComponentSelectCodeCountry() {
    this.filteredCodeCountry.next(this.code_countries.slice());
    this.codeCountryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCodeCountry();
      });
  }

  loadCodeCountries() {
    this._catalogService.getCodeCountries().subscribe({
      next: (resp) => {
        this.code_countries = resp;
      },
      complete: () => {
        this.loadComponentSelectCodeCountry()
        this.loading = false


      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      },
    });
  }
  
  // Productos 
  openCatalogProducts() {
    this._listPriceService
      .getAllData(this._userService.user.id_company.toString(), false)
      .subscribe({
        next: (resp) => {
          this.listPrices = resp;
  
          const dialogRef = this.dialog.open(PriceProductsComponent, {
            width: this.modalWidth,
            height: 'auto',
            data: {
              selectProducts: [...this.products],
              listPrice: this.listPrices,
            },
          });

          dialogRef.componentInstance.dataChange.subscribe((updatedProducts) => {
            this.products = updatedProducts; 
            this.loadProducts(); 
          });
  
          dialogRef.afterClosed().subscribe((updatedProducts) => {
            if (updatedProducts) {
              this.products = updatedProducts;
              this.loadProducts();
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
        },
      });
  }
  
  saveProducts() {
    // console.log('Datos guardados:', this.products);

    // Reinicia los productos seleccionados tras guardar
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    this.dataProducts = new MatTableDataSource(this.products);
    // console.log('Productos seleccionados:', this.dataProducts);
    
  }

  deleteProduct(product: ListRequestProduct) {
    this.products = this.products.filter((item) => item.id !== product.id); 
    this.loadProducts();  // Recargar la tabla
  }

  deleteProductByIndex(index: number) {
    const product = this.products[index];
    const productIndex = this.data.selectProducts.findIndex(
      (item: ListRequestProduct) => item.uniqueId === product.uniqueId
    );
  
    if (productIndex > -1) {
      this.data.selectProducts.splice(productIndex, 1);
    }
  
    this.products.splice(index, 1);
    this.loadProducts();
  }
  

  loadData() {
    this.loading = false;
  }

}
