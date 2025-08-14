# 🛡️ Guide du Système Anti-Spam pour Bot Telegram

## 📋 Vue d'ensemble

Ce système anti-spam protège votre bot Telegram contre le bannissement en implémentant des mesures de sécurité avancées qui simulent un comportement humain naturel et préviennent les abus.

## ✨ Fonctionnalités principales

### 1. **Limitation de débit (Rate Limiting)**
- **Par minute** : Maximum 30 messages globalement
- **Par heure** : Maximum 150 messages globalement  
- **Par jour** : Maximum 800 messages globalement
- **Par utilisateur** : 8 messages/minute, 40 messages/heure

### 2. **Détection de flood**
- Détecte les messages identiques répétés (3+ messages identiques = flood)
- Ban temporaire automatique de 3 minutes en cas de flood
- Protection contre les clics rapides sur les boutons

### 3. **Comportement humain simulé**
- Délai de frappe réaliste (40ms par caractère)
- Cooldown aléatoire entre messages (0.8 à 2.5 secondes)
- Indicateur "typing" avant l'envoi de messages
- Variations aléatoires pour éviter les patterns détectables

### 4. **Système de listes**
- **Liste blanche** : Utilisateurs exemptés des restrictions (admins)
- **Liste noire** : Utilisateurs bannis permanents
- **Bans temporaires** : Gestion automatique avec expiration

## 🔧 Configuration

Le système est configuré dans `/workspace/bot-telegram/bot.js` :

```javascript
const antiSpam = new AntiSpamSystem({
    maxMessagesPerMinute: 30,      
    maxMessagesPerHour: 150,       
    maxMessagesPerDay: 800,        
    userRateLimitMinute: 8,        
    userRateLimitHour: 40,          
    minCooldown: 800,               
    maxCooldown: 2500,              
    floodThreshold: 3,              
    floodBanDuration: 180000,       
    enableHumanBehavior: true,      
    typingDelay: 40,                
    maxTypingDelay: 4000,           
    debug: false                    
});
```

## 📝 Commandes Admin

### Gestion des listes

- `/whitelist <user_id>` - Ajouter un utilisateur à la liste blanche
- `/blacklist <user_id>` - Bannir un utilisateur permanent
- `/unban <user_id>` - Retirer un utilisateur de la liste noire

### Exemples d'utilisation

```
/whitelist 123456789
/blacklist 987654321
/unban 987654321
```

## 📊 Statistiques

Les statistiques anti-spam sont visibles dans le menu admin (`/admin` > Statistiques) :

- Messages envoyés (minute/heure/jour)
- Utilisateurs actifs
- Utilisateurs bannis temporairement
- Taille des listes blanche/noire

## 🚨 Messages d'avertissement

Le système envoie des avertissements automatiques :

- **Trop de messages** : "Trop de messages. Veuillez patienter..."
- **Flood détecté** : "Détection de spam. Évitez d'envoyer des messages identiques."
- **Clics rapides** : "Trop de clics rapides. Veuillez patienter."
- **Limite atteinte** : "Limite horaire/quotidienne atteinte. Réessayez plus tard."

## 🔒 Protection contre le bannissement

### Pourquoi ce système protège votre bot

1. **Respect des limites Telegram** : Évite de dépasser les limites API
2. **Comportement naturel** : Simule les délais humains de frappe et réflexion
3. **Prévention des abus** : Bloque automatiquement les spammeurs
4. **Gestion de charge** : Répartit les messages dans le temps

### Bonnes pratiques

1. **Ne pas désactiver le système** : Gardez toujours l'anti-spam actif
2. **Ajuster les limites** : Adaptez selon votre audience
3. **Surveiller les stats** : Vérifiez régulièrement les statistiques
4. **Liste blanche modérée** : N'ajoutez que les admins de confiance

## ⚙️ Personnalisation

Pour ajuster les paramètres, modifiez les valeurs dans `bot.js` :

```javascript
// Pour un bot plus permissif
maxMessagesPerMinute: 50,
userRateLimitMinute: 15,

// Pour un bot plus restrictif  
maxMessagesPerMinute: 20,
userRateLimitMinute: 5,
```

## 🔄 Maintenance

### Nettoyage automatique

- Les données anciennes sont nettoyées chaque minute
- Les bans temporaires expirent automatiquement
- L'historique des messages est limité à 100 entrées

### Réinitialisation manuelle

Pour réinitialiser un utilisateur :
```javascript
antiSpam.resetUser(userId);
```

## 📈 Monitoring

### Indicateurs à surveiller

1. **Taux de ban** : Si trop élevé, ajustez les limites
2. **Messages par minute** : Doit rester sous 30-40 pour la sécurité
3. **Utilisateurs actifs** : Croissance normale vs pics suspects

### Logs debug

Pour activer les logs détaillés :
```javascript
debug: true  // Dans la configuration
```

## 🆘 Dépannage

### Le bot répond lentement
- Réduisez `maxTypingDelay` et `typingDelay`
- Diminuez `maxCooldown`

### Trop d'utilisateurs bannis
- Augmentez les limites par utilisateur
- Réduisez `floodThreshold` à 5

### Bot toujours banni par Telegram
- Réduisez encore les limites globales
- Augmentez les cooldowns
- Vérifiez qu'aucun admin n'abuse de la liste blanche

## 📚 Architecture

Le système utilise :
- **Maps** pour stocker les données utilisateur
- **Sets** pour les listes blanches/noires
- **Timers** pour les réinitialisations périodiques
- **Promises** pour les délais asynchrones

## 🎯 Résultat attendu

Avec ce système, votre bot devrait :
- ✅ Éviter les bannissements Telegram
- ✅ Gérer des centaines d'utilisateurs en sécurité
- ✅ Bloquer automatiquement les spammeurs
- ✅ Maintenir une expérience fluide pour les vrais utilisateurs

---

💡 **Note importante** : Ce système a été conçu pour prévenir les bannissements dus à une utilisation excessive de l'API. Il ne garantit pas une protection à 100% contre tous les types de bannissements Telegram.