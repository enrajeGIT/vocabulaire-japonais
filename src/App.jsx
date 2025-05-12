import { useEffect, useState } from "react";

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
console.log(\"Vocabulaire chargé:\", vocabulaire);

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
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "2rem",
          backgroundColor: feedback ? "#e6ffed" : "#fff",
          boxShadow: feedback ? "0 0 10px rgba(72, 187, 120, 0.5)" : "none"
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{motActuel.mot}</h1>
        {showTranscription && (
          <p style={{ color: "#555", marginBottom: "1rem" }}>{motActuel.transcription}</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {melange.map((mot, i) => (
            <button
              key={i}
              onClick={() => verifier(mot)}
              disabled={selected !== null}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor:
                  selected === mot
                    ? feedback
                      ? "#4CAF50"
                      : "#f44336"
                    : "#f0f0f0",
                color: selected === mot ? "white" : "black",
                cursor: "pointer"
              }}
            >
              {mot}
            </button>
          ))}
        </div>
        {selected && !feedback && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "1rem" }}>
            Bonne réponse : {motActuel.traduction}
          </p>
        )}
        {selected && feedback && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "1rem" }}>✅ Bonne réponse !</p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button onClick={() => setShowTranscription(!showTranscription)}>
            {showTranscription ? "Masquer" : "Afficher"} transcription
          </button>
          <button onClick={suivant}>Suivant</button>
        </div>
      </div>
    </div>
  );
}
