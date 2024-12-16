import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/models/packages_bells';
import { RawMaterialProduct } from 'src/app/models/raw-material-product.model';
import { RawMaterial } from 'src/app/models/raw-material.model';
import { ProductService } from 'src/app/services/product.service';
import { RawMaterialService } from 'src/app/services/raw-material.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-raw-material-into-product',
    templateUrl: './add-raw-material-into-product.component.html',
    styleUrls: ['./add-raw-material-into-product.component.scss']
})
export class AddRawMaterialIntoProductComponent implements OnInit {
    loading: Boolean = false
    isDisabled: BooleanInput = false
    public is_percentage: boolean = false
    displayedColumnsRawMaterials: string[] = ['number', 'description', 'name_unit', 'actions'];
    form: FormGroup
    displayedColumnsRawMaterialsProducts: string[] = ['number', 'code', 'description', 'amount', 'actions'];
    colBig!: number;
    colXBig!: number
    colMedium!: number;
    colSmall!: number;
    dataSourceRawMaterials!: MatTableDataSource<any>;
    @ViewChild(MatSort) sort!: MatSort;
    dataSourceRawMaterialsProducts!: MatTableDataSource<any>;
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceRawMaterials.filter = filterValue.trim().toLowerCase();
    }
    constructor(private _rawMaterialService: RawMaterialService, private _userService: UserService, private _productService: ProductService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder) {
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
                    this.colXBig = 12
                }
                if (result.breakpoints[Breakpoints.Small]) {
                    this.colBig = 12
                    this.colMedium = 12
                    this.colSmall = 6
                    this.colXBig = 12
                }
                if (result.breakpoints[Breakpoints.Medium]) {
                    this.colBig = 12
                    this.colMedium = 4
                    this.colSmall = 4
                    this.colXBig = 12
                }
                if (result.breakpoints[Breakpoints.Large]) {
                    this.colBig = 6
                    this.colMedium = 4
                    this.colSmall = 2
                    this.colXBig = 10
                }
                if (result.breakpoints[Breakpoints.XLarge]) {
                    this.colBig = 6
                    this.colMedium = 4
                    this.colSmall = 2
                    this.colXBig = 10
                }
            }
        });

        this.form = this._formBuider.group({
            id_raw_material: ['', Validators.required],
            number: ['', Validators.required],
            code: ['', Validators.required],
            description: ['', Validators.required],
            amount: ['', Validators.required],
            is_percentage: [false, Validators.required]

        })

    }

    loadData() {
        this.loading = true
        this._rawMaterialService.getAllData(this._userService.user.id_company.toString(), false).subscribe({
            next: (resp) => {
                this.dataSourceRawMaterials = new MatTableDataSource(resp);
                this.dataSourceRawMaterialsProducts = new MatTableDataSource(this._productService.raw_materials_products)
            },
            complete: () => {
                this.loading = false
                this.dataSourceRawMaterials.sort = this.sort;
                this.isDisabled = false
            },
            error: (err) => {
                this.loading = false
                console.log(err)
            },
        })
    }

    /*
        PARA CALCULAR LA CANTIDAD CON PORCENTAJE:
        OBTENEMOS EL TOTAL: NUMERO DE CAJAS * EL PESO DE CADA CAJA
        DESPUES OBTENEMOS EL PORCENTAJE DE ESE TOTAL
        POR EJEMPLO: 1000*5 = 5000 EL 10% ES 500  
    */


    deleteRawMaterialProduct(index: number) {
        this._productService.raw_materials_products.splice(index, 1)
        this.dataSourceRawMaterialsProducts = new MatTableDataSource(this._productService.raw_materials_products);
        console.log(this._productService.raw_materials_products)
    }

    addRawMaterialIntoProduct() {
        let rawMaterialAux = this._productService.raw_materials_products.find(object => object.id_raw_material === this.form.value.id_raw_material)
        console.log(rawMaterialAux)
        if (rawMaterialAux == undefined) {
            this.insertRecordIntoTableRawMaterialProduct()
        } else {
            Swal.fire({
                title: 'EL PRODUCTO YA EXISTE',
                text: '¿DESEAS REMPLAZAR EL PRODUCTO EXISTE CON EL NUEVO?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'SI, REMPLAZAR',
                cancelButtonText: 'CANCELAR',
                confirmButtonColor: '#58B1F7',
                reverseButtons: true,
                heightAuto: false,
            }).then(result => {
                console.log(result)
                if (result.isConfirmed) {
                    this._productService.raw_materials_products = this._productService.raw_materials_products.filter(object => object.id_raw_material !== rawMaterialAux!.id_raw_material)
                    this.insertRecordIntoTableRawMaterialProduct()
                }
            })
        }
    }

    private insertRecordIntoTableRawMaterialProduct() {
        let amount = 0
        if (this.form.value.is_percentage) {
            amount = this._productService.total * this.form.value.amount / 100
        } else {
            amount = this.form.value.amount
        }
        const raw_material = { id_raw_material: this.form.value.id_raw_material, code: this.form.value.code, number: this.form.value.number, description: this.form.value.description, amount: amount }
        this._productService.raw_materials_products.push(raw_material)
        this.dataSourceRawMaterialsProducts = new MatTableDataSource(this._productService.raw_materials_products)

    }



    selectItem(item: RawMaterial) {
        this.form.controls['id_raw_material'].setValue(item.id)
        this.form.controls['number'].setValue(item.number)
        this.form.controls['code'].setValue(item.code)
        this.form.controls['description'].setValue(item.description)
    }

    changeTypeAmount() {
        this.is_percentage = this.form.value.is_percentage
    }


    ngOnInit(): void {

        this.loadData();

    }


    ngAfterViewInit() {


    }





}