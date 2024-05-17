const analyticalCardOverview = `query analyticalCard_Overview( $organization_unit_id: Int!, $supplier_id: Int, $date_of_start: String, $date_of_end: String, $date_of_start_booking: String, $date_of_end_booking: String) {
    analyticalCard_Overview( organization_unit_id: $organization_unit_id, supplier_id: $supplier_id, date_of_start: $date_of_start, date_of_end: $date_of_end, date_of_start_booking: $date_of_start_booking, date_of_end_booking: $date_of_end_booking){
        status
        items {
                initial_state
                sum_debit_amount_in_period
                sum_credit_amount_in_period
                sum_debit_amount
                sum_credit_amount
				supplier{
					id
					title
				}
                organization_unit{
                    id
                    title
                }
                date_of_start
                date_of_end
                items{
                    id
                    date
                    title
                    date_of_booking
                    credit_amount
                    debit_amount
					balance
                    document_number
                    formated_id_of_entry
                    type
                }
            }
        }
    }`;

export default analyticalCardOverview;
