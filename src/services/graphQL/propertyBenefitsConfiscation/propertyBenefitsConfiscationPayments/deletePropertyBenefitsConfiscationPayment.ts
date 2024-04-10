const deletePropertyBenefitsConfiscationPayment = `mutation($id: Int!) {
    propertyBenefitConfiscationPayment_Delete(id: $id) {
        message
        status
    }
}`;

export default deletePropertyBenefitsConfiscationPayment;
