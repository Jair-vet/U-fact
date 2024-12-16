export interface PaymentForm {
    total: number
    id_client: number
    id_payment_method: number
    attachment: File
    is_attachment: boolean
}