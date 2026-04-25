import { useParams } from "next/navigation";

export const useTokenVerifyEmail = () => {
  const params = useParams();
  const token = params.token as string;
  return token ? decodeURIComponent(token) : token;
};
