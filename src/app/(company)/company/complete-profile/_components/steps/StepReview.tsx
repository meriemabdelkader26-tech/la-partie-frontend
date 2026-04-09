import { ProfileCompanyFormData } from "../types";
import ReviewCompanyTypeImages from "./ReviewCompanyTypeImages";
import ReviewCompanyBasicInfo from "./ReviewCompanyBasicInfo";
import ReviewCompanyDetail from "./ReviewCompanyDetail";
import ReviewCompanyAddress from "./ReviewCompanyAddress";
import ReviewCompanyLanguages from "./ReviewCompanyLanguages";
import ReviewDescription from "./ReviewDescription";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import SubmitButton from "@/components/shared/SubmitButton";
import { useState } from "react";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface Props {
  formData: ProfileCompanyFormData;
  onComplete: () => void;
}

interface CompleteCompanyProfileResult {
  createCompanyProfile: {
    success: boolean;
    message: string;
  };
}

const StepReview = (props: Props) => {
  const { formData, onComplete } = props;
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    CompleteCompanyProfileResult,
    Error,
    ProfileCompanyFormData
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<CompleteCompanyProfileResult>(
        COMPLETE_COMPANY_PROFILE,
        {
          companyName: data.companyName,
          matricule: data.matricule,
          website: data.website || null,
          contactEmail: data.contactEmail,
          size: data.size,
          entrepriseType: data.entrepriseType,
          domainActivity: data.domainActivity,
          description: data.description,
          address: {
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
          langues: data.langues,
          disponibiliteCollaboration: data.disponibiliteCollaboration,
          images:
            data.imagesLogos?.map((img) => ({
              url: img.url,
              isPublic: img.isPublic,
              isDefault: img.isDefault,
            })) || [],
        }
      );
    },
    onSuccess: () => {
      toast.success("Company profile completed successfully!");
      setTimeout(onComplete, 2000);
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-8">
      {error && <ErrorTriangle message={error} />}

      <div className="flex flex-col gap-6">
        <ReviewCompanyTypeImages formData={formData} />
        <ReviewCompanyBasicInfo formData={formData} />
        <ReviewCompanyDetail formData={formData} />
        <ReviewCompanyAddress formData={formData} />
        <ReviewCompanyLanguages formData={formData} />
      </div>

      <ReviewDescription />

      <SubmitButton
        isLoading={mutation.isPending}
        loadingText="Saving Profile..."
      >
        Complete Profile
      </SubmitButton>
    </form>
  );
};

export default StepReview;

const COMPLETE_COMPANY_PROFILE = `
mutation CreateCompanyProfile($companyName: String!, $matricule: String, $website: String, $size: String, $description: String, $domainActivity: String, $contactEmail: String, $entrepriseType: String, $langues: [String], $disponibiliteCollaboration: String, $address: AddressInput, $images: [CompanyImageInput]) {
  createCompanyProfile(
    companyName: $companyName
    matricule: $matricule
    website: $website
    size: $size
    description: $description
    domainActivity: $domainActivity
    contactEmail: $contactEmail
    entrepriseType: $entrepriseType
    langues: $langues
    disponibiliteCollaboration: $disponibiliteCollaboration
    address: $address
    images: $images
  ) {
    success
    message
  }
}
`;
