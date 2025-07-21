import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, ArrowLeft, Save } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Loading } from '../components/UIComponents';
import EleveForm from '../components/EleveForm';

const EleveFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour savoir si on édite (id présent) ou on ajoute
  const [classes, setClasses] = useState([]);
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isEditing = !!id;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const classesRes = await apiService.get('/classes');
      setClasses(classesRes.data);
      
      if (isEditing) {
        const eleveRes = await apiService.get(`/eleves/${id}`);
        setEleve(eleveRes.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await apiService.put(`/eleves/${id}`, formData);
        alert('Élève modifié avec succès!');
      } else {
        await apiService.post('/eleves', formData);
        alert('Élève ajouté avec succès!');
      }
      navigate('/eleves');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'élève');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/eleves');
  };

  const pageActions = [
    {
      label: 'Retour à la liste',
      icon: ArrowLeft,
      onClick: handleCancel,
      variant: 'default'
    }
  ];

  if (loading) {
    return (
      <PageLayout 
        title={isEditing ? 'Modifier l\'élève' : 'Ajouter un élève'} 
        icon={Users}
      >
        <Loading text="Chargement..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isEditing ? 'Modifier l\'élève' : 'Ajouter un nouvel élève'}
      subtitle={isEditing ? `Modification de ${eleve?.prenom} ${eleve?.nom}` : 'Remplissez les informations ci-dessous'}
      icon={Users}
      actions={pageActions}
    >
      <Card title={isEditing ? 'Informations de l\'élève' : 'Nouvel élève'}>
        <EleveForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          classes={classes}
          initialData={eleve}
          isEditing={isEditing}
        />
      </Card>
    </PageLayout>
  );
};

export default EleveFormPage;