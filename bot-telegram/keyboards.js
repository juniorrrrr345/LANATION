// Clavier principal
function getMainKeyboard(config) {
    const keyboard = [];
    
    // Première ligne - Mini App si configurée
    if (config.miniApp && config.miniApp.url) {
        keyboard.push([{
            text: config.miniApp.text || '🎮 Mini Application',
            web_app: { url: config.miniApp.url }
        }]);
    }
    
    // Deuxième ligne - Boutons principaux
    keyboard.push([
        { text: 'ℹ️ Informations', callback_data: 'info' },
        { text: '🌐 Réseaux sociaux', callback_data: 'social' }
    ]);
    
    return { inline_keyboard: keyboard };
}

// Clavier admin complet
function getAdminKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: '📝 Modifier le message d\'accueil', callback_data: 'admin_message' }
            ],
            [
                { text: '🖼️ Modifier la photo d\'accueil', callback_data: 'admin_photo' }
            ],
            [
                { text: '📱 Modifier la mini application', callback_data: 'admin_miniapp' }
            ],
            [
                { text: '🌐 Gérer les réseaux sociaux', callback_data: 'admin_social' }
            ],
            [
                { text: 'ℹ️ Modifier les informations', callback_data: 'admin_info' }
            ],
            [
                { text: '📢 Envoyer un message à tous', callback_data: 'admin_broadcast' }
            ],
            [
                { text: '👥 Gérer les administrateurs', callback_data: 'admin_admins' }
            ],
            [
                { text: '📊 Statistiques du bot', callback_data: 'admin_stats' }
            ]
        ]
    };
}

// Clavier de gestion des réseaux sociaux
function getSocialManageKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: '➕ Ajouter', callback_data: 'social_add' },
                { text: '❌ Supprimer', callback_data: 'social_remove' }
            ],
            [
                { text: '📐 Disposition', callback_data: 'social_layout' }
            ],
            [
                { text: '🔙 Retour', callback_data: 'admin_back' }
            ]
        ]
    };
}

// Clavier de disposition des réseaux sociaux
function getSocialLayoutKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: '1️⃣', callback_data: 'layout_1' },
                { text: '2️⃣', callback_data: 'layout_2' },
                { text: '3️⃣', callback_data: 'layout_3' }
            ],
            [
                { text: '4️⃣', callback_data: 'layout_4' },
                { text: '5️⃣', callback_data: 'layout_5' },
                { text: '6️⃣', callback_data: 'layout_6' }
            ],
            [
                { text: '🔙 Retour', callback_data: 'admin_social' }
            ]
        ]
    };
}

// Clavier de confirmation
function getConfirmKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: '✅ Confirmer', callback_data: 'confirm' },
                { text: '❌ Annuler', callback_data: 'cancel' }
            ]
        ]
    };
}

module.exports = {
    getMainKeyboard,
    getAdminKeyboard,
    getSocialManageKeyboard,
    getSocialLayoutKeyboard,
    getConfirmKeyboard
};