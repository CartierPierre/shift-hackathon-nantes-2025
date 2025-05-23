import { useState } from "react";
import { motion } from "framer-motion";
import LearningPathCreation from "@/components/creation/LearningPathCreation";
import { PersonalizationForm } from "@/components/creation/PersonalizationForm";
import { PathView } from "@/components";
import { generateTreeFromCourseData } from "@/lib/tree-generator";
import { TreeData } from "@/types/tree";
import { generatePlanningTree, generateOnboarding } from "@/api/webhook";
import { saveToLocalStorage, getFromLocalStorage } from "@/utils/localStorage";
import LoadingBar from "@/components/ui/LoadingBar";
import { EditConversation } from "@/components/creation/EditConversation";

const Index = () => {
  const [stage, setStage] = useState<"creation" | "personalization" | "tree" | "loading" | "pathEdition">("creation");
  const [learningGoal, setLearningGoal] = useState<string>("");
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Génération de votre parcours d'apprentissage...");

  const handleCreatePath = async (goal: string) => {
    setLearningGoal(goal);
    const onboardData = await generateOnboarding(goal);
    setOnboardingData(onboardData);
    setStage("personalization");
  };

  const handlePersonalization = async (details: string) => {
    // Passer à l'étape de chargement
    setStage("loading");
    setLoadingMessage("Génération de votre parcours d'apprentissage personnalisé...");

    try {
      // Attendre la réponse de l'API
      const response = await generatePlanningTree(learningGoal, details);
      saveToLocalStorage("coursePlan", response);
      setLearningGoal(response.title)
      // Generate a tree locally without persisting
      const initialTree = generateTreeFromCourseData(response);
      setTreeData(initialTree);

      // Show the tree visualization
      setStage("pathEdition");
    } catch (error) {
      console.error("Error creating course:", error);
      setLoadingMessage("Une erreur est survenue. Veuillez réessayer.");
      // Après un délai, revenir à l'étape de personnalisation
      setTimeout(() => {
        setStage("personalization");
      }, 3000);
    }
  };

  const handlePathEditionSubmit = async () => {
    const localPlan = getFromLocalStorage("coursePlan", null);

    if (localPlan) {
      const initialTree = generateTreeFromCourseData(localPlan);
      setTreeData(initialTree);
      console.log("tree changed:", localPlan);
    }

    setStage("tree");
  }

  const handlePathChanges = async (details: string) => {
    // TODO: Handle path changes
    console.log("Path changes:", details);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Macott character background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 w-full h-[80vh]">
          <div className="relative w-full h-full">
            {/* Background color with wave shape */}
            <div
              className="absolute inset-x-0 bottom-0 w-full h-full bg-[#A6E3B8]"
              style={{
                clipPath: 'path("M 0 40 Q 50 0, 100 40 L 100 100 L 0 100 Z")',
              }}
            />
            {/* Macott face */}
            <div
              className="absolute left-1/2 bottom-[35%] -translate-x-1/2 w-[300px] aspect-[1/1.2]"
              style={{
                background: `url('/macott.svg') no-repeat center/contain`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 flex items-start sm:items-center justify-center relative z-10 pt-4 sm:pt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stage === "creation" && <LearningPathCreation onCreatePath={handleCreatePath} />}
        {stage === "personalization" && <PersonalizationForm goal={learningGoal} onboardMsg={onboardingData} onSubmit={handlePersonalization} />}
        {stage === "pathEdition" && treeData && <EditConversation treeData={treeData} onSubmit={handlePathChanges} onStart={handlePathEditionSubmit} />}
        {stage === "loading" && <LoadingBar message={loadingMessage} width={300} />}
        {stage === "tree" && <PathView learningGoal={learningGoal} treeData={treeData} />}
      </motion.div>
    </div>
  );
};

export default Index;
