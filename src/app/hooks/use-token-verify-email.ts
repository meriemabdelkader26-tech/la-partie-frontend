import { useParams } from "next/navigation";

export const useTokenVerifyEmail = () => {
  const params = useParams();
  return params.token as string;
};
