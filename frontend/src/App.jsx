import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Home from './pages/Home';
import FileUpload from './pages/FileUpload';
import OperationSelection from './pages/OperationSelection';
import Results from './pages/Results';
import Settings from './pages/Settings';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="App">
                    <Header />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/upload" component={FileUpload} />
                        <Route path="/operations" component={OperationSelection} />
                        <Route path="/results" component={Results} />
                        <Route path="/settings" component={Settings} />
                    </Switch>
                    <Toaster position="top-right" />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;