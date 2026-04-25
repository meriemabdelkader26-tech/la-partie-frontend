import { useParams } from "next/navigation";

export const useId = () => {
  const params = useParams();
  const id = params.id as string;
  return id ? decodeURIComponent(id) : id;
};
