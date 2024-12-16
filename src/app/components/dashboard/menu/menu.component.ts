import { Component } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';



import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';
import { JoyrideService } from 'ngx-joyride';
import { HelpService } from 'src/app/services/help.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { PackageBellService } from 'src/app/services/packages_bells.service';
import { Plan, Producto } from 'src/app/models/packages_bells';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/services/stripe.service';
import { ThemeComponent } from './components/theme/theme.component';
import { MatDialog } from '@angular/material/dialog';
import { EditPhraseComponent } from './components/edit-phrase/edit-phrase.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public steps!: string[]
  public user: User
  public pathIssues: string = 'https://docs.google.com/spreadsheets/d/1A7ryjTlMbISANi9tEHvdUPw_TrYdqKWUVYuQUVIfXtw/edit?usp=sharing'
  public plans!: Plan[]
  public products!: Producto[]
  public loadingPackage: boolean = false
  public permissionAdmin: boolean = false
  modalWidth!: string
  status!: OnlineStatusType;
  OnlineStatusType = OnlineStatusType;
  formPackage: FormGroup
  webViewSrc = "https://docs.nativescript.org/";


  constructor(private dialog: MatDialog, private _stripeService: StripeService, private _formBuider: FormBuilder, private _packageBellService: PackageBellService, private onlineStatusService: OnlineStatusService, private readonly joyrideService: JoyrideService, private _helpService: HelpService, private breakpointObserver: BreakpointObserver, private _userService: UserService, private _router: Router) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {

          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {

          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.Medium]) {

          this.modalWidth = '60%'
        }
        if (result.breakpoints[Breakpoints.Large]) {

          this.modalWidth = '40%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {

          this.modalWidth = '20%'
        }
      }
    });
    this.user = _userService.user
    this.permissionAdmin = this.user.id_rol == 3 || this.user.id_rol == 2 || this.user.id_rol == 1 ? true : false
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {

      this.status = status;
    });
    this.formPackage = this._formBuider.group({
      plan: ['', Validators.required],
      product: ['', Validators.required],
    })


  }

  reportIssue() {
    window.open(this.pathIssues, '_blank');

  }

  changeRoute(route: string) {

    this._router.navigateByUrl(route)
    if (this._userService.user.bells <= 5) {
      Swal.fire({ title: 'ADVERTENCIA', text: 'TE QUEDAN POCOS TIMBRES, NO TE QUEDES SIN FACTURAR', icon: 'warning', confirmButtonColor: '#58B1F7', heightAuto: false })
    }
  }

  openTheme() {
    const dialogRef = this.dialog.open(ThemeComponent, {
      width: this.modalWidth,
      height: 'auto',

    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Modal Theme Cerrado:', result);
    });
  }

  openEditPhrase() {
    const dialogRef = this.dialog.open(EditPhraseComponent, {
      width: this.modalWidth,
      height: 'auto',

    })
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Modal Theme Cerrado:', result);
    });
  }

  loadPlans() {
    this.loadingPackage = true
    this._packageBellService.getPlans().subscribe({
      next: (resp) => {
        this.loadingPackage = false

        this.plans = resp
      },
      error: (err) => {
        this.loadingPackage = false

        console.log(err)
      },
    })

  }
  loadProducts() {

    this.loadingPackage = true
    this._packageBellService.getProducts(this.formPackage.value.plan).subscribe({
      next: (resp) => {
        this.loadingPackage = false
        this.products = resp
        this.formPackage.controls['product'].setValue(this.products[0])
      },
      error: (err) => {
        this.loadingPackage = false
        console.log(err)
      },
    })

  }

  buyPackage() {

    this.loadingPackage = true
    this._stripeService.buyProduct(this.formPackage.value.product.Id_Stripe, this.user.id_company.toString(), this.formPackage.value.product.Id.toString(), this.formPackage.value.product.Costo_IVA.toString()).subscribe({
      next: (resp) => {
        this.loadingPackage = false
        window.open(resp.url, "_self");

      },
      error: (err) => {
        this.loadingPackage = false
        console.log(err)
      },

    })
  }

  showHelp() {
    this.steps = this._helpService.help()
    this.joyrideService.startTour({
      steps: this.steps,
      customTexts: {
        next: '>',
        prev: '<',
        done: 'Ok'
      }
    });
  }
  ngAfterViewInit(): void {
  }



  runLogout() {

    Swal.fire({
      title: 'CERRAR SESIÓN',
      text: "¿ESTAS SEGURO DE QUERER SALIR?",
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._userService.logout()
        this._router.navigateByUrl('login')
      }
    })


  }


}



