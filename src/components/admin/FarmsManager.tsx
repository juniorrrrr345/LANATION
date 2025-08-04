'use client';
import { useState, useEffect } from 'react';

interface Farm {
  _id?: string;
  name: string;
  description?: string;
}

export default function FarmsManager() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState<Partial<Farm>>({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/farms');
      if (response.ok) {
        const data = await response.json();
        setFarms(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData(farm);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Veuillez entrer un nom pour la farm');
      return;
    }

    try {
      const url = editingFarm ? `/api/farms/${editingFarm._id}` : '/api/farms';
      const method = editingFarm ? 'PUT' : 'POST';
      
      console.log('💾 Sauvegarde farm:', { url, method, data: formData });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Message de succès
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]';
        successMsg.textContent = editingFarm ? '✅ Farm modifiée!' : '✅ Farm ajoutée!';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
        
        setShowModal(false);
        await loadFarms();
        
        // Forcer la synchronisation
        try {
          await fetch('/api/cache/invalidate', { method: 'POST' });
        } catch (e) {
          console.error('Erreur invalidation cache:', e);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur sauvegarde:', errorText);
        alert(`Erreur: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (farmId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette farm ?')) {
      try {
        const response = await fetch(`/api/farms/${farmId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadFarms();
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Gestion des Farms</h1>
        <button
          onClick={handleAdd}
          className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-lg flex items-center space-x-2 w-full sm:w-auto"
        >
          <span>➕</span>
          <span className="hidden sm:inline">Ajouter une farm</span>
          <span className="sm:hidden">Nouvelle</span>
        </button>
      </div>

      {/* Liste des farms avec scroll */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {farms.map((farm) => (
            <div key={farm._id} className="bg-gray-900 border border-white/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-white text-xl">{farm.name}</h3>
              </div>
            
            {farm.description && (
              <p className="text-gray-400 text-sm mb-4">{farm.description}</p>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(farm)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(farm._id!)}
                className="bg-red-600 hover:bg-red-500 text-white py-2 px-3 rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Modal d'édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingFarm ? 'Modifier la farm' : 'Ajouter une farm'}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-3 py-2"
                  placeholder="Ex: REAL FARMZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-3 py-2 h-20"
                  placeholder="Description de la farm..."
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-lg flex-1"
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}