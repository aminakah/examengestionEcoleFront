import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: '📊', roles: ['admin', 'enseignant'] },
    ];

    const adminItems = [
      { id: 'eleves', label: 'Gestion des élèves', icon: '👨‍🎓', roles: ['admin'] },
      { id: 'enseignants', label: 'Gestion des enseignants', icon: '👩‍🏫', roles: ['admin'] },
      { id: 'classes', label: 'Gestion des classes', icon: '🏫', roles: ['admin'] },
      { id: 'matieres', label: 'Gestion des matières', icon: '📚', roles: ['admin'] },
    ];

    const enseignantItems = [
      { id: 'notes', label: 'Saisie des notes', icon: '📝', roles: ['admin', 'enseignant'] },
      { id: 'bulletins', label: 'Bulletins', icon: '📄', roles: ['admin', 'enseignant'] },
    ];

    const parentItems = [
      { id: 'bulletins-parent', label: 'Bulletins de mon enfant', icon: '👶', roles: ['parent'] },
    ];

    return [...baseItems, ...adminItems, ...enseignantItems, ...parentItems]
      .filter(item => item.roles.includes(user?.role));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '280px',
      height: '100vh',
      backgroundColor:'#05317E',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '0',
      overflow: 'hidden',
      overflowY: 'auto',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
      zIndex: 1000
    }}>
      {/* Overlay décoratif */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}></div>
      
      {/* Avatar utilisateur */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px ',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginLeft: '1rem',
          marginRight:'10px',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.8)'
        }}>
          🎓
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#feffffff',
            marginBottom: '0.25rem',
            lineHeight: '1.2'
          }}>EduPortal</div>
         
        </div>
      </div>

      {/* Menu navigation */}
      <div style={{
        padding: '1rem 0',
        position: 'relative',
        zIndex: 1
      }}>
      
        {getMenuItems().map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: currentPage === item.id ? '#0d52b3ff' : '#ffffffff',
              borderRadius: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              margin: '0.25rem 1rem',

              background: currentPage === item.id ? '#ffffffff' : 'transparent',
              transform: currentPage === item.id ? 'translateX(8px)' : 'translateX(0)',
              boxShadow: currentPage === item.id ? '0 10px 25px rgba(59, 130, 246, 0.3)' : 'none'
            }}
            className="hover-lift"
          >
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              fontSize: '1.1rem',
              transition: 'transform 0.3s ease'
            }}>
              <span>{item.icon}</span>
            </div>
            <span style={{
              flex: 1,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>{item.label}</span>
            {currentPage === item.id && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}></div>
            )}
          </button>
        ))}
      </div>

      {/* Section aide */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '1.5rem',
        right: '1.5rem',
        zIndex: 1
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '1rem',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            fontSize: '1rem'
          }}>💡</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>Besoin d'aide ?</div>
            <div style={{
              fontSize: '0.7rem',
              color: '#6b7280',
              lineHeight: '1.3'
            }}>Consultez notre guide</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;