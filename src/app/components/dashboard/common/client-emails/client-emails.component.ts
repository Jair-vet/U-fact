import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/models/client.model';
import { Contact } from 'src/app/models/contact.model';
import { Departure } from 'src/app/models/departure.model';
import { DocumentPDF } from 'src/app/models/document.model';
import { Entry } from 'src/app/models/entry.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Order } from 'src/app/models/order.model';
import { PaymentPlugin } from 'src/app/models/payment-plugin.model';
import { Provider } from 'src/app/models/provider.model';
import { PurchaseOrder } from 'src/app/models/purchase-order.model';
import { QuotationRequest } from 'src/app/models/quotation-request.model';
import { ClientService } from 'src/app/services/client.service';
import { ContactService } from 'src/app/services/contact.service';
import { ProviderService } from 'src/app/services/provider.service';
import { ToolService } from 'src/app/services/tools.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-client-emails',
  templateUrl: './client-emails.component.html',
  styleUrls: ['./client-emails.component.scss']
})
export class ClientEmailsComponent implements OnInit {
  loading = true
  error = false
  error_msg = ''
  client!: Client
  provider!: Provider
  form: FormGroup
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  emails: Contact[] = []
  eventId!: number
  documents: DocumentPDF[] = []
  displayedColumnsContacts: string[] = ['actions', 'email', 'name', 'type'];
  dataContacts!: MatTableDataSource<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _userService: UserService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _contactService: ContactService, private _toolsService: ToolService, private _clientService: ClientService, private _providerService: ProviderService, public dialogRef: MatDialogRef<ClientEmailsComponent>) {
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
          this.colSmall = 3
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 3
        }
      }
    });
    this.form = this._formBuider.group({
      subject: ['', [Validators.required]],
      title: [''],
      body: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    console.log(this.data)
    if (this.data.type == 'purchase-order') {
      this.loadProvider()
    } else {
      this.loadClient()
    }
  }

  loadProvider() {
    this._providerService.getData(this.data.id_client.toString()).subscribe({
      next: (resp) => {
        this.provider = resp;
      },
      complete: () => {
        this.loadEmails('provider')
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },
    }
    )
  }

  getBodyEmail(code: string, isTrazability: boolean, isProvider: boolean) {
    if (isTrazability) {
      if (isProvider) {
        return `Estimado(a): ${this.provider.name}, Adjunto encontrara los documentos emitidos por ${this._userService.user.name_company}`
      } else {
        return `Estimado(a): ${this.client.name}, Adjunto encontrara los documentos emitidos por ${this._userService.user.name_company}`

      }
    } else {
      if (isProvider) {
        return `Estimado(a): ${this.provider.name}, El motivo de este correo electronico es notificarle que ${this._userService.user.name_company} le ha emitido un documento electronico con el identificador: ${code}. Sus documentos se encuentran adjuntos.`
      } else {
        return `Estimado(a): ${this.client.name}, El motivo de este correo electronico es notificarle que ${this._userService.user.name_company} le ha emitido un documento electronico con el identificador: ${code}. Sus documentos se encuentran adjuntos.`
      }
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }

  loadPDFS() {

    if (this.data.type == 'traceability') {
      this.form.controls['body'].setValue(this.getBodyEmail('', true, false))
      this.loadTraceabilityPDFS()
      this.form.controls['subject'].setValue('TRAZABILIDAD')
      this.form.controls['title'].setValue('TRAZABILIDAD')

    }
    else if (this.data.type == 'departures') {
      this.loadDepartures(this.data.data.departures)
      if (this.data.data.departures.length > 0) {
        this.form.controls['body'].setValue(this.getBodyEmail(this.data.data.departures[0].folio, false, false))
      }
      this.form.controls['subject'].setValue('NOTA DE VENTA')
      this.form.controls['title'].setValue('NOTAS DE VENTA')

    }

    else if (this.data.type == 'invoices') {
      this.loadInvoices(this.data.data.invoices)
      if (this.data.data.invoices.length > 0) {
        this.form.controls['body'].setValue(this.getBodyEmail((`${this.data.data.invoices[0].serie}-${this.data.data.invoices[0].number}`), false, false))
      }
      this.form.controls['subject'].setValue('FACTURAS')
      this.form.controls['title'].setValue('FACTURAS')


    }
    else if (this.data.type == 'payment-plugins') {
      this.loadPaymentPlugins(this.data.data.payments_plugins)
      if (this.data.data.payments_plugins.length > 0) {
        this.form.controls['body'].setValue(this.getBodyEmail((`${this.data.data.payments_plugins[0].serie}-${this.data.data.payments_plugins[0].number}`), false, false))
      }
      this.form.controls['subject'].setValue('COMPLEMENTOS DE PAGO')
      this.form.controls['title'].setValue('COMPLEMENTOS DE PAGO')
    }
    else if (this.data.type == 'purchase-order') {
      this.loadPurchaseOrder(this.data.data.purchase)

      this.form.controls['body'].setValue(this.getBodyEmail((`${this.data.data.purchase.folio}`), false, true))
      this.form.controls['subject'].setValue('ORDEN DE COMPRA')
      this.form.controls['title'].setValue('ORDEN DE COMPRA')
    }

    else if (this.data.type == 'quotation-request') {

      this.loadQuotationRequest(this.data.data.quotations_request)

      this.form.controls['body'].setValue(this.getBodyEmail((`${this.data.data.quotations_request.folio}`), false, false))
      this.form.controls['subject'].setValue('COTIZACIÓN')
      this.form.controls['title'].setValue('COTIZACIÓN')
    }

  }

  loadTraceabilityPDFS() {
    this.loadEntries(this.data.data.certificates)
    this.loadDepartures(this.data.data.departures)
    this.loadInvoices(this.data.data.invoices)
    this.loadPaymentPlugins(this.data.data.payments_plugins)
    this.loadOrder(this.data.data.order)
  }

  loadPurchaseOrder(purchase: PurchaseOrder) {
    const document = new DocumentPDF('', purchase.folio, 6, purchase.id)
    this.addDocument(document)
  }
  loadQuotationRequest(quotation_request: QuotationRequest) {
    const document = new DocumentPDF('', quotation_request.folio, 7, quotation_request.id)
    this.addDocument(document)
  }


  loadOrder(orders: Order[]) {
    let i = 0
    while (i < orders.length) {
      if (orders[i].selected) {
        const document = new DocumentPDF(`https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/${orders[i].path_file}`, orders[i].folio + '-PEDIDO', 5, orders[i].id)
        this.addDocument(document)
      }
      i++
    }
  }

  loadDepartures(departures: Departure[]) {
    let i = 0
    while (i < departures.length) {

      if (departures[i].select_sale_note) {
        const document = new DocumentPDF('', departures[i].folio + '-NV', 1, departures[i].id)
        this.addDocument(document)
      }
      if (departures[i].select_packing_list) {
        const document = new DocumentPDF('', departures[i].folio + '-PL', 2, departures[i].id)
        this.addDocument(document)
      }
      i++
    }
  }

  loadPaymentPlugins(payments_plugins: PaymentPlugin[]) {
    let i = 0
    while (i < payments_plugins.length) {
      if (payments_plugins[i].selected) {
        const payment = new DocumentPDF(`https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Complementos/${payments_plugins[i].path_pdf}`, payments_plugins[i].serie + '-' + payments_plugins[i].number, 4, payments_plugins[i].id)
        this.addDocument(payment)
        const xml = new DocumentPDF(`https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Complementos/${payments_plugins[i].path_pdf}`, payments_plugins[i].serie + '-' + payments_plugins[i].number, 4.1, payments_plugins[i].id)
        this.addDocument(xml)
      }
      i++
    }
  }

  loadEntries(entries: Entry[]) {
    let i = 0
    while (i < entries.length) {
      if (entries[i].selected) {
        const document = new DocumentPDF('', entries[i].number.toString() + '-INFORME', 0, entries[i].id)
        this.addDocument(document)
      }
      i++
    }
  }

  loadInvoices(invoices: Invoice[]) {
    let i = 0

    while (i < invoices.length) {
      if (invoices[i].selected) {
        const invoice = new DocumentPDF(`https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Invoices/${invoices[i].path_pdf}`, invoices[i].serie + '-' + invoices[i].number + '-FACTURA', 3, invoices[i].id)
        this.addDocument(invoice)
        const xml = new DocumentPDF(`https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Invoices/${invoices[i].path_xml}`, invoices[i].serie + '-' + invoices[i].number + '-XML', 3.1, invoices[i].id)
        this.addDocument(xml)
      }
      i++
    }
  }

  deleteDocument(event: number) {
    this.documents.splice(event, 1)
  }

  addDocument(document: DocumentPDF) {
    this.documents.push(document)
  }

  sendEmail() {
    this.loading = true
    this._toolsService.sendEmail(this.emails, this.documents, this.form.value.subject, this.form.value.body, this.form.value.title).subscribe({
      next: (resp) => {
        Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        this.loading = false
      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        console.log(err)
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        this.loading = false
      },
    })
  }

  loadClient() {
    this._clientService.getClient(this.data.id_client.toString()).subscribe({
      next: (resp) => {
        this.client = resp;
      },
      complete: () => {
        this.loadEmails('client')
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },
    }
    )
  }



  loadEmails(type: string) {
    this._contactService.getContacts(this.data.id_client, type).subscribe({
      next: (resp) => {
        this.dataContacts = new MatTableDataSource(resp);
      },
      complete: () => {
        this.loading = false
        this.loadPDFS()
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.error_msg = err.error.message
      },
    })
  }

  select(contact: Contact, select: boolean) {
    contact.selected = select
    if (select) {
      this.emails.push(contact)
    } else {
      this.emails = this.emails.filter((item: Contact) => item.id !== contact.id);
    }
  }
}
