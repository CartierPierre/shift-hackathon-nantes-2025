# Exercizer

Un composant React réutilisable pour afficher et évaluer des exercices et évaluations interactifs.

## Aperçu

Exercizer est un outil dynamique qui prend en entrée un sujet ou une compétence, récupère la structure d'un exercice, affiche le formulaire/les questions appropriées et évalue les réponses de l'utilisateur.

## Fonctionnalités

- Récupération dynamique d'exercices basés sur un sujet/une compétence
- Support pour différents types de questions :
  - Questions à choix multiples (QCM)
  - Questions à trous
  - Questions avec glisser-déposer de mots
  - Questions basées sur des médias (image, vidéo, audio)
- Évaluation des réponses avec feedback détaillé
- Personnalisation des exercices basée sur le contexte de l'étudiant
- Fonctionnalité de réessai
- Suivi des résultats
- Personnalisation des couleurs du thème

## Installation

```bash
npm install exercizer
# ou
yarn add exercizer
```

## Utilisation basique

```jsx
import { Exercizer } from 'exercizer';

function MonApplication() {
  const handleComplete = (result) => {
    console.log('Exercice terminé:', result);
    // result contient { subject, success, score }
  };

  return (
    <div className="container">
      <h1>Pratique de mathématiques</h1>
      <Exercizer 
        subject="math" 
        onComplete={handleComplete}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Description | Par défaut |
|------|------|-------------|------------|
| `subject` | string | Le sujet ou la compétence pour lequel récupérer des exercices | (obligatoire) |
| `context` | string | Contexte de l'étudiant pour personnaliser les exercices | "" |
| `contentType` | string | Type de contenu préféré pour les exercices | "multiple_choice" |
| `onComplete` | function | Fonction de callback appelée lorsque l'utilisateur termine un exercice | () => {} |
| `themeColor` | string | Couleur du thème pour personnaliser l'interface (code hexadécimal) | "#0891b2" |
| `showBanner` | boolean | Affiche ou masque l'image d'ambiance en haut de l'exercice | true |
| `apiAdapter` | object | Adaptateur personnalisé pour intégrer votre propre API | null |

## Types de questions supportés

Le composant Exercizer prend en charge plusieurs types de questions :

- **Questions à choix multiples** (`multiple_choice` ou `mcq`) : Questions classiques où l'utilisateur doit sélectionner une ou plusieurs réponses parmi des options.
- **Questions à trous** (`fill_in_the_blanks` ou `fill-in-blank`) : L'utilisateur doit remplir les espaces vides dans un texte.
- **Glisser-déposer de mots** (`drag_the_words`) : L'utilisateur doit réorganiser des mots pour former une phrase correcte.
- **Questions avec média** : Questions accompagnées d'une image, d'une vidéo ou d'un fichier audio pour enrichir le contexte.

## Personnalisation avec contexte étudiant

Vous pouvez personnaliser les exercices en fonction du profil de l'étudiant en fournissant un contexte :

```jsx
<Exercizer 
  subject="français, conjugaison, présent"
  context="Élève de 6ème, 12 ans, passion pour la lecture"
  onComplete={handleComplete}
/>
```

## Options de personnalisation

Exercizer offre plusieurs options pour personnaliser l'apparence et l'expérience utilisateur :

### Thème de couleur

Vous pouvez personnaliser la couleur principale du composant pour l'adapter à votre charte graphique :

```jsx
<Exercizer 
  subject="mathématiques"
  themeColor="#4F46E5" // Couleur indigo
/>
```

### Affichage de la bannière

Vous pouvez choisir d'afficher ou masquer l'image d'ambiance en haut des exercices :

```jsx
<Exercizer 
  subject="anglais"
  showBanner={false} // Masque l'image d'ambiance
/>
```

### Personnalisation complète

Exemple combinant toutes les options de personnalisation :

```jsx
<Exercizer 
  subject="histoire, moyen-âge, féodalité"
  context="Élève de 5ème, intéressé par les châteaux forts et les chevaliers"
  contentType="drag_the_words"
  themeColor="#16A34A"
  showBanner={true}
  onComplete={(result) => {
    console.log(`Score obtenu : ${result.score}/100`);
    // Logique de suivi des résultats
  }}
/>
```

## Intégration API

Par défaut, Exercizer utilise des fonctions API simulées. Pour vous connecter à votre backend :

1. Créez un adaptateur API qui correspond à l'interface attendue par Exercizer
2. Passez votre adaptateur au composant

Exemple :

```jsx
import { Exercizer } from 'exercizer';
import monAdaptateurApi from './monAdaptateurApi';

function MonApplication() {
  return (
    <Exercizer 
      subject="math" 
      apiAdapter={monAdaptateurApi}
    />
  );
}
```

### Structure d'un adaptateur API

Votre adaptateur API doit implémenter les méthodes suivantes :

```javascript
const monAdaptateurApi = {
  // Récupère un exercice basé sur un sujet et contexte
  fetchExercise: async (subject, context, contentType) => {
    // Implémentation personnalisée
    // Doit retourner un objet exercice compatible
    return {
      id: "exercice-id",
      title: "Titre de l'exercice",
      description: "Description de l'exercice",
      questions: [...],  // Tableau de questions
      bannerImage: "url-de-image"  // Optionnel
    };
  },
  
  // Soumet et évalue les réponses de l'utilisateur
  submitAnswers: async (exerciseId, userAnswers) => {
    // Implémentation personnalisée
    // Doit retourner un objet évaluation
    return {
      success: true,
      score: 85,
      feedback: [...],  // Tableau de feedback par question
    };
  },
  
  // Enregistre les résultats (optionnel)
  logResult: async (exerciseId, result) => {
    // Implémentation personnalisée pour enregistrer les résultats
  }
};
```

## Documentation

Pour une documentation complète et détaillée, visitez [https://calderis.github.io/suw-2025-aixercice/](https://calderis.github.io/suw-2025-aixercice/)

## Licence

MIT
