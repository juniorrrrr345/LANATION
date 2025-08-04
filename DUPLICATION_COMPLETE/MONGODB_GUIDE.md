# 🗄️ GUIDE MONGODB ATLAS - CRÉATION D'UNE BASE INDÉPENDANTE

## 1️⃣ CRÉER UN COMPTE MONGODB ATLAS

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Cliquer sur "Try Free"
3. Créer un compte avec email/Google

## 2️⃣ CRÉER UN NOUVEAU CLUSTER

1. Cliquer sur "Build a Cluster"
2. Choisir **FREE** (M0 Sandbox)
3. Choisir la région la plus proche
4. Nommer le cluster (ex: "ma-boutique-cluster")
5. Cliquer sur "Create Cluster"

## 3️⃣ CONFIGURER LA SÉCURITÉ

### Créer un utilisateur :
1. Dans "Security" → "Database Access"
2. Cliquer "Add New Database User"
3. Remplir :
   - Username: `boutique_user`
   - Password: **Générer un mot de passe fort**
   - Rôle: "Atlas Admin"
4. Cliquer "Add User"

### Autoriser les connexions :
1. Dans "Security" → "Network Access"
2. Cliquer "Add IP Address"
3. Cliquer "Allow Access from Anywhere"
4. Confirmer avec "Add IP Address"

## 4️⃣ RÉCUPÉRER L'URI DE CONNEXION

1. Retourner sur "Clusters"
2. Cliquer sur "Connect"
3. Choisir "Connect your application"
4. Copier l'URI qui ressemble à :
   ```
   mongodb+srv://boutique_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 5️⃣ PERSONNALISER L'URI

Remplacer dans l'URI :
- `<password>` par votre mot de passe
- Ajouter le nom de votre base avant le `?` :

```
mongodb+srv://boutique_user:VotreMotDePasse@cluster0.xxxxx.mongodb.net/ma_boutique?retryWrites=true&w=majority
```

## 6️⃣ TESTER LA CONNEXION

Dans votre fichier `.env.local` :
```env
MONGODB_URI=mongodb+srv://boutique_user:VotreMotDePasse@cluster0.xxxxx.mongodb.net/ma_boutique?retryWrites=true&w=majority
```

## ⚠️ IMPORTANT - INDÉPENDANCE TOTALE

- **CHAQUE BOUTIQUE** doit avoir :
  - Son propre cluster OU
  - Sa propre base de données (nom différent)
  - Son propre utilisateur (recommandé)

- **NE JAMAIS** :
  - Utiliser la même URI que PLUGFR1
  - Partager les credentials entre boutiques
  - Utiliser le même nom de base de données

## 🔍 VÉRIFICATION

Pour vérifier que votre base est bien indépendante :

1. Dans MongoDB Atlas → "Collections"
2. Vous devriez voir votre base `ma_boutique`
3. Elle doit être vide au début
4. Après configuration dans l'admin, vous verrez :
   - `categories`
   - `products`
   - `farms`
   - `settings`
   - `pages`

## 🆘 PROBLÈMES COURANTS

### "Authentication failed"
- Vérifier le mot de passe
- Vérifier le username
- Recréer l'utilisateur si nécessaire

### "Network error"
- Vérifier que 0.0.0.0/0 est autorisé
- Attendre 2-3 minutes après l'ajout

### "Database not found"
- Normal au début, sera créée automatiquement
- Vérifier le nom dans l'URI

---

💡 **Conseil** : Gardez vos credentials MongoDB dans un gestionnaire de mots de passe sécurisé !