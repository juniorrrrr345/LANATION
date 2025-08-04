# 🌐 Variables d'environnement complètes pour Vercel

## 🔧 Configuration dans Vercel Dashboard

Allez dans votre projet Vercel → Settings → Environment Variables

### 📋 Variables à ajouter :

| Nom de la variable | Valeur | Description |
|-------------------|---------|-------------|
| `MONGODB_URI` | `mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation` | Connection string MongoDB Atlas |
| `CLOUDINARY_CLOUD_NAME` | `dwez3etsh` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | `567536976535776` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | `RRiC4Hdh50szrTQMDHSRi3kxZZE` | Secret API Cloudinary |
| `JWT_SECRET` | `votre_jwt_secret_tres_long_et_complexe_123456789` | Secret pour JWT (changez-le) |
| `JWT_EXPIRES_IN` | `7d` | Expiration du token JWT |
| `STRIPE_SECRET_KEY` | `sk_test_votre_cle_stripe_secrete` | Clé secrète Stripe |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_votre_cle_stripe_publique` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_votre_webhook_secret` | Secret webhook Stripe |
| `EMAIL_HOST` | `smtp.gmail.com` | Serveur SMTP |
| `EMAIL_PORT` | `587` | Port SMTP |
| `EMAIL_USER` | `votre_email@gmail.com` | Email SMTP |
| `EMAIL_PASS` | `votre_mot_de_passe_app` | Mot de passe app Gmail |
| `NODE_ENV` | `production` | Environnement |
| `FRONTEND_URL` | `https://votre-app.vercel.app` | URL frontend |
| `ADMIN_EMAIL` | `admin@votre-site.com` | Email admin |
| `ADMIN_PASSWORD` | `Admin123!` | Mot de passe admin (changez-le) |
| `SENDGRID_API_KEY` | `SG.votre_cle_sendgrid` | Clé API SendGrid (optionnel) |
| `GOOGLE_CLIENT_ID` | `votre_google_client_id` | Google OAuth (optionnel) |
| `GOOGLE_CLIENT_SECRET` | `votre_google_client_secret` | Google OAuth secret (optionnel) |
| `FACEBOOK_APP_ID` | `votre_facebook_app_id` | Facebook OAuth (optionnel) |
| `FACEBOOK_APP_SECRET` | `votre_facebook_app_secret` | Facebook OAuth secret (optionnel) |

## 🔐 Variables de sécurité importantes

### JWT Secret (Générez-en un nouveau)
```bash
# Générez un secret JWT sécurisé
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Stripe Keys (Test)
- **Secret Key** : Commence par `sk_test_`
- **Publishable Key** : Commence par `pk_test_`
- **Webhook Secret** : Commence par `whsec_`

### Email Configuration
- **Gmail** : Activez "Less secure app access" ou utilisez un mot de passe d'application
- **SendGrid** : Alternative plus sécurisée pour l'envoi d'emails

## 🚀 Déploiement

### 1. Ajoutez toutes les variables dans Vercel
### 2. Déployez votre application
### 3. Configurez les webhooks Stripe
### 4. Testez le panel admin

## 📊 Panel Admin

**URL Admin** : `https://votre-app.vercel.app/admin`
**Email** : `admin@votre-site.com`
**Mot de passe** : `Admin123!`

## ⚠️ Notes de sécurité

1. **Changez** tous les mots de passe par défaut
2. **Générez** un nouveau JWT_SECRET
3. **Configurez** les vraies clés Stripe pour la production
4. **Activez** l'authentification à deux facteurs
5. **Limitez** l'accès admin par IP si possible

## 🔗 URLs importantes

- **Frontend** : `https://votre-app.vercel.app`
- **API** : `https://votre-app.vercel.app/api`
- **Admin** : `https://votre-app.vercel.app/admin`
- **Webhook Stripe** : `https://votre-app.vercel.app/api/webhooks/stripe`

## 📧 Configuration Email

### Option 1 : Gmail
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

### Option 2 : SendGrid
```
SENDGRID_API_KEY=SG.votre_cle_sendgrid
```

## 💳 Configuration Stripe

1. Créez un compte Stripe
2. Récupérez vos clés dans le dashboard
3. Configurez les webhooks
4. Testez avec les cartes de test

## 🔐 Authentification OAuth (Optionnel)

### Google OAuth
1. Créez un projet Google Cloud
2. Configurez OAuth 2.0
3. Ajoutez les URLs de redirection

### Facebook OAuth
1. Créez une app Facebook
2. Configurez les permissions
3. Ajoutez les URLs de redirection