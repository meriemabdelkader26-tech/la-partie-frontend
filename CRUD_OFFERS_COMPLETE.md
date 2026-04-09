# CRUD Complet - Gestion des Offres (Offers)

## Vue d'ensemble

Ce document décrit l'implémentation complète du CRUD (Create, Read, Update, Delete) pour la gestion des offres dans l'espace Company de la plateforme influBridge.

## Structure des pages créées

### 1. **CREATE - Nouvelle offre** 
📁 `src/app/(company)/company/campaigns/new/page.tsx`

**Fonctionnalités :**
- Formulaire complet pour créer une nouvelle offre
- Validation de tous les champs en temps réel
- Champs inclus :
  - Titre de l'offre (min 5 caractères)
  - Objectif de collaboration (min 20 caractères)
  - Exigences (min 20 caractères)
  - Budget minimum et maximum (avec validation)
  - Date de début et fin (validation de cohérence)
  - Nombre d'influenceurs recherchés (1-100)
- Gestion des erreurs avec messages explicites
- Redirection automatique après création réussie
- États de chargement pendant la soumission

**GraphQL Mutation utilisée :**
```graphql
mutation CreateOffer(
  $title: String!
  $minBudget: Float!
  $maxBudget: Float!
  $startDate: Date!
  $endDate: Date!
  $influencerNumber: Int!
  $requirement: String!
  $objectif: String!
)
```

---

### 2. **READ - Détails d'une offre**
📁 `src/app/(company)/company/campaigns/[id]/page.tsx`

**Fonctionnalités :**
- Affichage complet des informations de l'offre
- 4 cartes statistiques :
  - Nombre total de candidatures
  - Candidatures en attente
  - Candidatures approuvées
  - Objectif d'influenceurs
- Détails de l'offre dans des cartes séparées :
  - Objectif de la collaboration
  - Exigences
  - Budget (min et max)
  - Période (dates de début et fin)
- Liste complète des candidatures avec :
  - Photo de profil de l'influenceur
  - Nom et username
  - Message de candidature
  - Statut avec badge coloré
  - Date de candidature
- Modal de confirmation pour la suppression
- Menu d'actions (modifier, supprimer)
- Bouton pour gérer les candidatures
- États de chargement (Skeleton)

**GraphQL Query utilisée :**
```graphql
query GetOffer($id: ID!) {
  offer(id: $id) {
    id
    title
    objectif
    requirement
    minBudget
    maxBudget
    startDate
    endDate
    influencerNumber
    createdAt
    applications {
      id
      influencer { ... }
      message
      status
      createdAt
    }
  }
}
```

---

### 3. **UPDATE - Modification d'une offre**
📁 `src/app/(company)/company/campaigns/[id]/edit/page.tsx`

**Fonctionnalités :**
- Chargement automatique des données existantes
- Formulaire pré-rempli avec les valeurs actuelles
- Même validation que la création
- Sections organisées en cartes :
  - Informations de base
  - Budget
  - Période de collaboration
  - Influenceurs recherchés
- Boutons d'action :
  - Annuler (retour aux détails)
  - Enregistrer les modifications
- Gestion des erreurs par champ
- États de chargement pendant la mise à jour
- Redirection automatique après modification réussie

**GraphQL Mutations utilisées :**
```graphql
query GetOffer($id: ID!) { ... }

mutation UpdateOffer($offerId: ID!, $input: UpdateOfferInput!) {
  updateOffer(offerId: $offerId, input: $input) {
    offer { ... }
  }
}
```

---

### 4. **DELETE - Suppression d'une offre**
📁 Intégré dans `src/app/(company)/company/campaigns/[id]/page.tsx`

**Fonctionnalités :**
- Modal de confirmation avant suppression
- Avertissement si l'offre a des candidatures
- Message indiquant que les candidatures seront aussi supprimées
- Boutons de confirmation :
  - Annuler
  - Supprimer (bouton rouge destructif)
- État de chargement pendant la suppression
- Redirection automatique vers la liste après suppression
- Overlay sombre pour le modal

**GraphQL Mutation utilisée :**
```graphql
mutation DeleteOffer($offerId: ID!) {
  deleteOffer(offerId: $offerId) {
    success
    message
  }
}
```

---

### 5. **BONUS - Gestion des candidatures**
📁 `src/app/(company)/company/campaigns/[id]/applications/page.tsx`

**Fonctionnalités :**
- 4 cartes statistiques :
  - Total des candidatures
  - En attente
  - Approuvées
  - Rejetées
- Barre de recherche pour filtrer par nom ou message
- Système d'onglets pour filtrer par statut :
  - Toutes
  - En attente
  - Approuvées
  - Rejetées
- Pour chaque candidature :
  - Photo de profil
  - Nom complet et username
  - Email de l'influenceur
  - Bio de l'influenceur
  - Message de candidature (encadré)
  - Badge de statut coloré
  - Icône de statut
  - Date et heure de candidature
  - Boutons d'action (pour les candidatures en attente) :
    - Rejeter (bouton rouge)
    - Approuver (bouton vert)
- États de chargement pendant les actions
- Rechargement automatique après action
- Message si aucune candidature

**GraphQL Queries/Mutations utilisées :**
```graphql
query GetOfferApplications($id: ID!) { ... }

mutation ApproveApplication($applicationId: ID!) {
  approveApplication(applicationId: $applicationId) {
    application {
      id
      status
    }
  }
}

mutation RejectApplication($applicationId: ID!) {
  rejectApplication(applicationId: $applicationId) {
    application {
      id
      status
    }
  }
}
```

---

## Navigation mise à jour

### Liste des offres - `src/app/(company)/company/campaigns/page.tsx`

**Modifications apportées :**
- Menu déroulant (DropdownMenu) sur chaque carte d'offre avec :
  - ✅ Voir détails → `/company/campaigns/[id]`
  - ✅ Modifier → `/company/campaigns/[id]/edit`
  - ✅ Gérer les candidatures → `/company/campaigns/[id]/applications`

---

## Mutations GraphQL ajoutées

Ajoutées dans `src/lib/queries/offer-queries.ts` :

```typescript
// Approuver une candidature
export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($applicationId: ID!) {
    approveApplication(applicationId: $applicationId) {
      success
      message
      errors
      application {
        id
        status
      }
    }
  }
`;

// Rejeter une candidature
export const REJECT_APPLICATION = gql`
  mutation RejectApplication($applicationId: ID!) {
    rejectApplication(applicationId: $applicationId) {
      success
      message
      errors
      application {
        id
        status
      }
    }
  }
`;
```

---

## Validation des données

### Règles de validation appliquées :

1. **Titre** :
   - Requis
   - Minimum 5 caractères

2. **Objectif** :
   - Requis
   - Minimum 20 caractères

3. **Exigences** :
   - Requises
   - Minimum 20 caractères

4. **Budget** :
   - Budget minimum : requis, positif
   - Budget maximum : requis, positif, supérieur au minimum

5. **Dates** :
   - Date de début : requise
   - Date de fin : requise, postérieure à la date de début

6. **Nombre d'influenceurs** :
   - Requis
   - Entre 1 et 100

---

## Composants UI utilisés

- `Card`, `CardContent`, `CardHeader`, `CardTitle` - Structure des contenus
- `Button` - Actions utilisateur
- `Input` - Champs texte et nombres
- `Textarea` - Champs multilignes
- `Label` - Labels des formulaires
- `Badge` - Badges de statut
- `Skeleton` - États de chargement
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Filtrage par onglets
- `DropdownMenu` - Menus d'actions

---

## Badges de statut

### Statut des candidatures :
- 🟡 **PENDING** → "En attente" (jaune)
- 🟢 **APPROVED** → "Approuvée" (vert)
- 🔴 **REJECTED** → "Rejetée" (rouge)
- ⚫ **WITHDRAW** → "Retirée" (gris)

### Statut des offres :
- 🟢 **En cours** → Offre active (dates actuelles entre début et fin)
- 🔵 **À venir** → Offre pas encore commencée
- ⚫ **Terminée** → Offre passée

---

## Points techniques importants

### 1. Authentication
Toutes les requêtes utilisent le token JWT stocké dans les cookies :
```typescript
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("access_token="))
  ?.split("=")[1];
```

### 2. Gestion des erreurs
- Affichage des erreurs de validation par champ
- Messages d'erreur en rouge sous les champs
- Alerts pour les erreurs de serveur
- Redirection vers login si token invalide

### 3. États de chargement
- Skeleton components pendant le chargement initial
- Boutons désactivés avec texte "Chargement..." pendant les actions
- Indicateurs visuels pour les états asynchrones

### 4. Routing
- Utilisation de `useRouter` pour la navigation programmatique
- `useParams` pour récupérer les IDs dynamiques
- Redirections automatiques après succès

---

## Backend requis

### Queries nécessaires :
✅ `offer(id: ID!)` - Récupérer une offre
✅ `myOffers` - Liste des offres de l'utilisateur
✅ `companyDashboardStats` - Statistiques

### Mutations nécessaires :
✅ `createOffer` - Créer une offre
✅ `updateOffer` - Modifier une offre
✅ `deleteOffer` - Supprimer une offre
✅ `approveApplication` - Approuver une candidature
✅ `rejectApplication` - Rejeter une candidature

---

## Résumé

Le CRUD complet pour la gestion des offres est maintenant **100% fonctionnel** avec :

1. ✅ **Create** : Formulaire de création avec validation complète
2. ✅ **Read** : Page de détails avec statistiques et candidatures
3. ✅ **Update** : Formulaire de modification pré-rempli
4. ✅ **Delete** : Suppression avec confirmation
5. ✅ **Bonus** : Gestion avancée des candidatures (approve/reject)

Toutes les pages sont reliées entre elles avec une navigation fluide et cohérente. L'interface est moderne, responsive et suit les conventions UI/UX de la plateforme.
