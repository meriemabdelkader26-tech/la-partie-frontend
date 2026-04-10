export const UPDATE_OFFER_APPLICATION_STATUS = `
mutation UpdateOfferApplicationStatus($applicationId: ID!, $status: String!) {
  updateOfferApplicationStatus(applicationId: $applicationId, status: $status) {
    ok
    application {
      submittedAt
      user {
        email
        name
        role
      }
      status
      reviewedAt
      rejectionReason
      proposal
      deliveryDays
      askingPrice
      adminNotes
    }
  }
}
`;