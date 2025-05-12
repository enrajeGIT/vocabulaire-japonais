import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [vocabulaire, setVocabulaire] = useState([]);
  const [index, setIndex] = useState(0);
  const [showTranscription, setShowTranscription] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch("/vocabulaire.json")
      .then((res) => res.json())
      .then((data) => {
        setVocabulaire(data);
        setIndex(Math.floor(Math.random() * data.length));
      });
  }, []);

  if (vocabulaire.length === 0) {
    return <div className="p-6 text-center">Chargement...</div>;
  }

  const motActuel = vocabulaire[index];
  const bonnesReponses = [motActuel.traduction];
  const autres = vocabulaire.filter((_, i) => i !== index).map((m) => m.traduction);
  const propositions = [...bonnesReponses, ...autres.slice(0, 3)];
  const melange = propositions.sort(() => Math.random() - 0.5);

  const verifier = (reponse) => {
    setSelected(reponse);
    setFeedback(reponse === motActuel.traduction);
  };

  const suivant = () => {
    setIndex(Math.floor(Math.random() * vocabulaire.length));
    setSelected(null);
    setFeedback(null);
    setShowTranscription(false);
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <Card className={feedback ? "border-green-400 ring-2 ring-green-300 transition-all duration-300" : ""}>
        <CardContent className="text-center p-6 space-y-4">
          <h1 className="text-3xl font-bold">{motActuel.mot}</h1>
          {showTranscription && <p className="text-gray-600">{motActuel.transcription}</p>}
          <div className="grid grid-cols-1 gap-2">
            {melange.map((mot, i) => (
              <Button
                key={i}
                variant={selected === mot ? (feedback ? "default" : "destructive") : "outline"}
                onClick={() => verifier(mot)}
                disabled={selected !== null}
              >
                {mot}
              </Button>
            ))}
          </div>
          {selected && !feedback && (
            <p className="text-green-600 font-semibold">Bonne réponse : {motActuel.traduction}</p>
          )}
          {selected && feedback && (
            <p className="text-green-600 font-semibold">✅ Bonne réponse !</p>
          )}
          <div className="flex justify-between pt-4">
            <Button onClick={() => setShowTranscription(!showTranscription)} variant="ghost">
              {showTranscription ? "Masquer" : "Afficher"} transcription
            </Button>
            <Button onClick={suivant}>Suivant</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
