import { Injectable } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  public state = '1'
  constructor() { }


  help() {
    if (this.state == '1') {
      return this.showHelpMenu()
    }
    else if (this.state == '2') {
      return this.showHelpInvoice()
    }
    else if (this.state == '2-1') {
      return this.showHelpCreateInvoice()
    }
    else if (this.state == '2-2') {
      return this.showHelpDuplicateInvoice()
    }
    else if (this.state == '3') {
      return this.showHelpPreInvoice()
    }

    else if (this.state == '3-1') {
      return this.showHelpCreatePreInvoice()
    }

    else if (this.state == '3-2') {
      return this.showHelpEditPreInvoice()
    }


    else if (this.state == '3-3') {
      return this.showHelpStampPreInvoice()
    }

    else if (this.state == '4') {
      return this.showHelpClient()
    }

    else if (this.state == '4-1') {
      return this.showHelpCreateClient()
    }

    else if (this.state == '4-2') {
      return this.showHelpEditClient()
    }

    else if (this.state == '5') {
      return this.showHelpProduct()
    }

    else if (this.state == '5-1') {
      return this.showHelpCreateProduct()
    }

    else if (this.state == '5-2') {
      return this.showHelpEditProduct()
    }

    else if (this.state == '6') {
      return this.showHelpSettings()
    }
    else if (this.state == '7') {
      return this.showHelpCert()
    }
    else {
      return this.showHelpMenu()
    }
  }
  showHelpCert() {
    return ['settings']
  }
  showHelpMenu() {
    return ['help', 'bells', 'menu', 'logo', 'dashboard', 'invoice', 'preinvoice', 'client', 'product', 'settings', 'logout']
  }

  showHelpInvoice() {
    return ['help', 'bells', 'menu', 'logo', 'dashboard', 'invoice', 'preinvoice', 'client', 'product', 'settings', 'logout', 'invoiceStep1', 'invoiceStep2', 'invoiceStep3', 'invoiceStep4', 'invoiceStep5']
  }

  showHelpCreateInvoice() {
    return ['createinvoiceStep1', 'createinvoiceStep2', 'createinvoiceStep3', 'createinvoiceStep4', 'createinvoiceStep5', 'createinvoiceStep6', 'createinvoiceStep7']
  }

  showHelpDuplicateInvoice() {
    return ['duplicateinvoiceStep1', 'duplicateinvoiceStep2', 'duplicateinvoiceStep3', 'duplicateinvoiceStep4', 'duplicateinvoiceStep5', 'duplicateinvoiceStep6', 'duplicateinvoiceStep7', 'duplicateinvoiceStep8']
  }

  showHelpPreInvoice() {
    return ['preinvoiceStep1', 'preinvoiceStep2', 'preinvoiceStep3', 'preinvoiceStep4']
  }


  showHelpCreatePreInvoice() {
    return ['createpreinvoiceStep1', 'createpreinvoiceStep2', 'createpreinvoiceStep3', 'createpreinvoiceStep4', 'createpreinvoiceStep5', 'createpreinvoiceStep6', 'createpreinvoiceStep7']
  }

  showHelpEditPreInvoice() {
    return ['editpreinvoiceStep1', 'editpreinvoiceStep2', 'editpreinvoiceStep3', 'editpreinvoiceStep4', 'editpreinvoiceStep5', 'editpreinvoiceStep6', 'editpreinvoiceStep7']

  }
  showHelpStampPreInvoice() {
    return ['stamp_preinvoiceStep1', 'stamp_preinvoiceStep2', 'stamp_preinvoiceStep3', 'stamp_preinvoiceStep4', 'stamp_preinvoiceStep5', 'stamp_preinvoiceStep6', 'stamp_preinvoiceStep7']

  }

  showHelpClient() {
    return ['clientStep1', 'clientStep2', 'clientStep3', 'clientStep4', 'clientStep5']
  }


  showHelpCreateClient() {
    return ['createclientStep1', 'createclientStep2', 'createclientStep3', 'createclientStep4', 'createclientStep5', 'createclientStep6']
  }

  showHelpEditClient() {
    return ['editclientStep1', 'editclientStep2', 'editclientStep3', 'editclientStep4', 'editclientStep5', 'editclientStep6']
  }


  showHelpProduct() {
    return ['productStep1', 'productStep2', 'productStep3', 'productStep4', 'productStep5', 'productStep6']
  }


  showHelpCreateProduct() {
    return ['createproductStep1', 'createproductStep2', 'createproductStep3', 'createproductStep4', 'createproductStep5']
  }

  showHelpEditProduct() {
    return ['editproductStep1', 'editproductStep2', 'editproductStep3', 'editproductStep4', 'editproductStep5']
  }

  showHelpSettings() {
    return ['settingsStep1', 'settingsStep2', 'settingsStep3', 'settingsStep4', 'settingsStep5']
  }

  helpInvoice() {
    this.state = '2'
  }
  helpCreateInvoice() {
    this.state = '2-1'
  }
  helpDuplicateInvoice() {
    this.state = '2-2'
  }

  helpPreInvoice() {
    this.state = '3'
  }

  helpCreatePreInvoice() {
    this.state = '3-1'
  }

  helpEditPreInvoice() {
    this.state = '3-2'
  }
  helpStampPreInvoice() {
    this.state = '3-3'
  }

  helpClient() {
    this.state = '4'
  }

  helpCreateClient() {
    this.state = '4-1'
  }

  helpEditClient() {
    this.state = '4-2'
  }
  helpProduct() {
    this.state = '5'
  }

  helpCreateProduct() {
    this.state = '5-1'
  }

  helpEditProduct() {
    this.state = '5-2'
  }

  helpSettings() {
    this.state = '6'
  }
  helpCert() {
    this.state = '7'
  }

}
