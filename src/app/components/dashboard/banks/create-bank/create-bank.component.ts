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
import { Bank } from 'src/app/models/bank.model';
import { BankAccountService } from 'src/app/services/bank-account.service';

const clearFields = environment.clearFields

@Component({
    selector: 'app-create-bank',
    templateUrl: './create-bank.component.html',
    styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {

    loading = true
    panelOpenState = false
    error = false
    error_msg = ''
    form: FormGroup
    colBig!: number;
    colMedium!: number;
    colSmall!: number;
    path: string = 'dashboard/banks'
    pathImageDefault: string = './assets/img/no-image.png'
    banks!: Bank[]
    public banksCtrl: FormControl = new FormControl();
    public banksFilterCtrl: FormControl = new FormControl();
    public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
    public display: boolean = true;

    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;


    protected _onDestroy = new Subject<void>();


    constructor(private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _userService: UserService, private _bankAccountService: BankAccountService, private _satService: SatService) {

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
                    this.colMedium = 6
                    this.colSmall = 4
                }
                if (result.breakpoints[Breakpoints.Large]) {
                    this.colBig = 6
                    this.colMedium = 6
                    this.colSmall = 2
                }
                if (result.breakpoints[Breakpoints.XLarge]) {
                    this.colBig = 6
                    this.colMedium = 6
                    this.colSmall = 2
                }
            }
        });

        this.form = this._formBuider.group({
            type_account: ['', Validators.required],
            clabe: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            account: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],

        })
    }


    cancel() {
        this._router.navigateByUrl(this.path)
    }

    clearFields() {
        if (clearFields) {
            this.form.reset({
                type_account: '',
                account: '',
                clabe: '',

            })
        }
    }

    create() {
        this.loading = true
        console.log(this.form.value.type_account)
        if (this.banksCtrl.value) {
            this._bankAccountService.create(this.banksCtrl.value.id, this.form.value.type_account, this.form.value.account, this.form.value.clabe).subscribe({
                next: (resp) => {
                    Swal.fire({
                        title: 'AGREGAR BANCO',
                        text: '¿DESEAS SEGUIR AGREGANDO BANCO O REGRESAR AL LISTADO?',
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
        } else {
            this.loading = false
            Swal.fire({ title: 'ERROR', text: 'NO HAZ SELECCIONADO EL BANCO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })

        }

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

    loadBanks() {

        this._satService.getBanks().subscribe({
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
        this.error = this._userService.checkPermissionAdmin().error
        this.error_msg = this._userService.checkPermissionAdmin().message
        this.loadBanks()


    }
}
