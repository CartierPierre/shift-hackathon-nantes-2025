import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";

interface PersonalizationFormProps {
  goal: string;
  onboardMsg: string;
  onSubmit: (details: string) => void;
}

export const PersonalizationForm = ({ goal, onboardMsg, onSubmit }: PersonalizationFormProps) => {
  const [details, setDetails] = useState("");
  const scrollToBottom = useScrollToBottom();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <motion.div
      className="w-full max-w-lg mx-auto my-auto flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center gap-24 text-center">
        <h1 className="la-primary text-3xl font-bold tracking-tight">Personnalise ton apprentissage</h1>
        <div className="space-y-3">
          <p className="text-lg mx-4 text-muted-foreground">
            {onboardMsg}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="fixed bottom-0  px-4 pb-4 left-0 right-0 w-full flex flex-col gap-4">
          <div className="relative">
            <Input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onFocus={scrollToBottom}
              placeholder="..."
              className="h-14 px-4 pr-12 text-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button
              type="submit"
              size="icon"
              variant="default"
              className="absolute right-2 top-2 h-10 w-10 bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
