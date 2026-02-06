import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Types derived from schema
type CheckHomeworkInput = z.infer<typeof api.homework.check.input>;
type CheckHomeworkResponse = z.infer<typeof api.homework.check.responses[200]>;
type HistoryResponse = z.infer<typeof api.homework.history.responses[200]>;

export function useHistory() {
  return useQuery({
    queryKey: [api.homework.history.path],
    queryFn: async () => {
      const res = await fetch(api.homework.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.homework.history.responses[200].parse(await res.json());
    },
  });
}

export function useCheckHomework() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CheckHomeworkInput) => {
      // Validate input before sending
      const validated = api.homework.check.input.parse(data);
      
      const res = await fetch(api.homework.check.path, {
        method: api.homework.check.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to check homework");
      }

      return api.homework.check.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.homework.history.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
