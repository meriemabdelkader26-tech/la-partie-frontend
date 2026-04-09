import { useParams } from "next/navigation";

export const useIdParam = () => {
  const params = useParams();
  const id = params.id as string;
  try {
    return id.includes("%") ? decodeURIComponent(id) : id;
  } catch {
    return id;
  }
};
