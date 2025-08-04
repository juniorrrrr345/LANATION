import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    // Contenu par défaut pour chaque page
    const defaultPages = [
      {
        slug: 'info',
        title: 'À propos',
        content: `# Bienvenue chez LANATIONDULAIT

## Notre Histoire

LANATIONDULAIT est votre destination privilégiée pour découvrir une sélection unique de produits de qualité. Fondée avec passion et dévouement, notre boutique s'engage à vous offrir une expérience d'achat exceptionnelle.

## Nos Valeurs

### 🌟 Qualité Premium
Nous sélectionnons rigoureusement chaque produit pour garantir une qualité irréprochable. Chaque article est choisi avec soin pour répondre aux standards les plus élevés.

### 💝 Service Client
Votre satisfaction est notre priorité absolue. Notre équipe dévouée est toujours prête à vous accompagner et répondre à vos besoins.

### 🚀 Innovation
Nous restons constamment à l'écoute des dernières tendances pour vous proposer des produits innovants et modernes.

### 🤝 Confiance
Nous construisons une relation de confiance durable avec chacun de nos clients, basée sur la transparence et l'honnêteté.

## Pourquoi Choisir LANATIONDULAIT ?

### Produits Authentiques
- **Sélection rigoureuse** : Chaque produit est testé et approuvé
- **Origine vérifiée** : Traçabilité complète de nos articles
- **Garantie qualité** : Satisfaction ou remboursement

### Livraison Express
- **Expédition rapide** : Commandes traitées sous 24h
- **Suivi en temps réel** : Suivez votre colis à chaque étape
- **Emballage soigné** : Protection maximale de vos achats

### Prix Compétitifs
- **Meilleurs prix garantis** : Rapport qualité-prix imbattable
- **Promotions régulières** : Profitez de nos offres exclusives
- **Programme fidélité** : Récompenses pour nos clients réguliers

## Notre Engagement

Chez LANATIONDULAIT, nous nous engageons à :
- Maintenir les plus hauts standards de qualité
- Offrir un service client exceptionnel
- Respecter l'environnement dans nos pratiques
- Innover constamment pour votre satisfaction

## Rejoignez Notre Communauté

Suivez-nous sur les réseaux sociaux pour découvrir nos nouveautés, promotions exclusives et conseils d'experts.

**Merci de votre confiance et bienvenue dans l'univers LANATIONDULAIT !**`,
        updatedAt: new Date()
      },
      {
        slug: 'contact',
        title: 'Contact',
        content: `# Contactez-Nous

## Nous Sommes Là Pour Vous

Chez LANATIONDULAIT, votre satisfaction est notre priorité. N'hésitez pas à nous contacter pour toute question, suggestion ou demande d'information.

## 📧 Email
**contact@lanationdulait.com**
Réponse garantie sous 24h

## 📱 Téléphone
**+33 1 23 45 67 89**
Lundi - Vendredi : 9h00 - 18h00
Samedi : 10h00 - 17h00

## 📍 Adresse
**LANATIONDULAIT**
123 Avenue du Commerce
75001 Paris, France

## 💬 Réseaux Sociaux
- **Instagram** : @lanationdulait
- **Facebook** : /lanationdulait
- **Twitter** : @lanationdulait

## 🕐 Horaires d'Ouverture
- **Lundi - Vendredi** : 9h00 - 19h00
- **Samedi** : 10h00 - 18h00
- **Dimanche** : Fermé

## Service Client

Notre équipe de service client est disponible pour répondre à toutes vos questions :
- Questions sur les produits
- Suivi de commande
- Retours et échanges
- Suggestions et commentaires

## Formulaire de Contact

Pour nous contacter directement depuis notre site, utilisez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.

**Nous sommes impatients de vous entendre !**`,
        updatedAt: new Date()
      },
      {
        slug: 'questions',
        title: 'Questions Fréquentes',
        content: `# Questions Fréquentes

## 🛍️ Commandes

### Comment passer une commande ?
1. Parcourez notre catalogue et ajoutez les produits au panier
2. Cliquez sur le panier pour vérifier votre commande
3. Procédez au paiement sécurisé
4. Recevez la confirmation par email

### Puis-je modifier ma commande ?
Vous pouvez modifier votre commande dans les 2 heures suivant la validation. Contactez-nous rapidement par email ou téléphone.

### Comment suivre ma commande ?
Un email de confirmation avec un numéro de suivi vous sera envoyé dès l'expédition de votre commande.

## 📦 Livraison

### Quels sont les délais de livraison ?
- **Standard** : 3-5 jours ouvrés
- **Express** : 24-48h
- **International** : 7-15 jours selon la destination

### Quels sont les frais de livraison ?
- **Gratuite** dès 50€ d'achat
- **Standard** : 4,90€
- **Express** : 9,90€

### Livrez-vous à l'international ?
Oui, nous livrons dans toute l'Europe et dans de nombreux pays du monde.

## 💳 Paiement

### Quels moyens de paiement acceptez-vous ?
- Cartes bancaires (Visa, Mastercard, American Express)
- PayPal
- Apple Pay / Google Pay
- Virement bancaire

### Le paiement est-il sécurisé ?
Oui, tous les paiements sont cryptés et sécurisés par SSL. Vos données bancaires ne sont jamais stockées.

## 🔄 Retours et Échanges

### Quelle est votre politique de retour ?
Vous disposez de 14 jours après réception pour retourner un produit non utilisé dans son emballage d'origine.

### Comment effectuer un retour ?
1. Contactez notre service client
2. Recevez l'étiquette de retour par email
3. Emballez soigneusement le produit
4. Déposez le colis au point relais

### Quand serai-je remboursé ?
Le remboursement est effectué sous 5-7 jours après réception et vérification du produit retourné.

## 🎁 Programme Fidélité

### Comment fonctionne le programme fidélité ?
- 1€ dépensé = 1 point
- 100 points = 5€ de réduction
- Offres exclusives pour les membres

### Comment m'inscrire ?
L'inscription est automatique lors de votre première commande. Vous recevrez vos identifiants par email.

## 📞 Contact

### Comment vous contacter ?
- **Email** : contact@lanationdulait.com
- **Téléphone** : +33 1 23 45 67 89
- **Chat** : Disponible sur le site
- **Réseaux sociaux** : @lanationdulait

### Quels sont vos horaires ?
- **Service client** : Lun-Ven 9h-18h, Sam 10h-17h
- **Chat en ligne** : 7j/7 de 9h à 20h

**D'autres questions ? N'hésitez pas à nous contacter !**`,
        updatedAt: new Date()
      }
    ];
    
    // Insérer ou mettre à jour chaque page
    const results = [];
    for (const page of defaultPages) {
      const result = await pagesCollection.replaceOne(
        { slug: page.slug },
        page,
        { upsert: true }
      );
      results.push({
        slug: page.slug,
        modified: result.modifiedCount,
        upserted: result.upsertedCount
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Pages initialisées avec succès',
      results
    });
    
  } catch (error) {
    console.error('❌ Erreur init pages:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}