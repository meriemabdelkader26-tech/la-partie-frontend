export const CREATE_OFFER_APPLICATION_MUTATION = `
mutation createOfferApplication($askingPrice: Float!, $offerId: ID!, $proposal: String!) {
  createOfferApplication(
    askingPrice: $askingPrice
    offerId: $offerId
    proposal: $proposal
  ) {
    application {
      adminNotes
      askingPrice
      coverLetter
      deliveryDays
      estimatedReach
      id
      portfolioLinks
      proposal
      rejectionReason
      reviewedAt
      status
      submittedAt
      updatedAt
    }
  }
}
`;
