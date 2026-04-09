import { useParams } from "next/navigation";

export const useId = () => {
  const params = useParams();
  return params.id as string;
};
