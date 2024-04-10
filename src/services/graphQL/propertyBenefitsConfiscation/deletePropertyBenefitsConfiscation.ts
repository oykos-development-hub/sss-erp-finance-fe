const deletePropertyBenefitsConfiscation = `mutation($id: Int!) {
    propertyBenefitConfiscation_Delete(id: $id) {
        message
        status
    }
}`;

export default deletePropertyBenefitsConfiscation;
