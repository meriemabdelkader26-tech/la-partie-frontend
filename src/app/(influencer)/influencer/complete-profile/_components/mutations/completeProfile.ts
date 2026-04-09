export const COMPLETE_INFLUENCER_PROFILE_MUTATION = `
  mutation CompleteInfluencerProfile(
    $biography: String!
    $centresInteret: [String]
    $typeContenu: [String]!
    $siteWeb: String
    $selectedReels: [InstagramReelInput]
    $selectedPosts: [InstagramPostInput]
    $selectedCategories: [ID]!
    $reseauxSociaux: [ReseauSocialInput]!
    $pseudo: String
    $portfolioMedia: [PortfolioMediaInput]
    $offresCollaboration: [OffreCollaborationInput]
    $localisation: String!
    $langues: [String]!
    $instagramUsername: String!
    $images: [ImageInput]
    $disponibiliteCollaboration: DisponibiliteEnum
  ) {
    completeInfluencerProfile(
      biography: $biography
      centresInteret: $centresInteret
      typeContenu: $typeContenu
      siteWeb: $siteWeb
      selectedReels: $selectedReels
      selectedPosts: $selectedPosts
      selectedCategories: $selectedCategories
      reseauxSociaux: $reseauxSociaux
      pseudo: $pseudo
      portfolioMedia: $portfolioMedia
      offresCollaboration: $offresCollaboration
      localisation: $localisation
      langues: $langues
      instagramUsername: $instagramUsername
      images: $images
      disponibiliteCollaboration: $disponibiliteCollaboration
    ) {
      message
      success
    }
  }
`;
