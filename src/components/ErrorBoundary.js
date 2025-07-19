import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour le state pour afficher l'UI d'erreur au prochain rendu
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur pour le monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Ici, vous pourriez envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Oups ! Une erreur s'est produite
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Nous nous excusons pour ce problème technique.
                </p>
              </div>

              <div className="mt-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Détails de l'erreur
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p className="font-mono text-xs bg-red-100 p-2 rounded">
                          {this.state.error && this.state.error.toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={this.handleReload}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recharger la page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Si le problème persiste, veuillez contacter l'administrateur.
                </p>
              </div>

              {/* Affichage des détails techniques en mode développement */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6 bg-gray-100 p-4 rounded text-xs">
                  <summary className="cursor-pointer font-semibold text-gray-700">
                    Détails techniques (développement)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-gray-600">
                    {this.state.error && this.state.error.stack}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
