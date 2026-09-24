import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveOutages } from './components/LiveOutages';
import { HowItWorks } from './components/HowItWorks';
import { CitizensAndTeams } from './components/CitizensAndTeams';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SignInScreen } from './components/SignInScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { CitizenDashboard } from './components/CitizenDashboard';
import { DepartmentDashboard } from './components/DepartmentDashboard';
import { IncidentDetailScreen } from './components/IncidentDetailScreen';
import { ReportOutageScreen } from './components/ReportOutageScreen';
import { ReportGroupingScreen } from './components/ReportGroupingScreen';
import { ToastContainer } from './components/ToastContainer';
import { initialIncidentsData, initialCrewsData } from './data/mockIncidentsStore';
import { initialNotificationsData } from './data/mockNotificationsStore';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'signin' | 'signup' | 'citizen-demo' | 'department-demo' | 'incident-detail' | 'report-outage' | 'report-grouping'
  const [selectedIncidentId, setSelectedIncidentId] = useState('west-district');
  const [incidentsData, setIncidentsData] = useState(initialIncidentsData);
  const [crewsData, setCrewsData] = useState(initialCrewsData);
  const [notifications, setNotifications] = useState(initialNotificationsData);
  const [toasts, setToasts] = useState([]);

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handlePublishNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev]);
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), type: 'info', message: `Update Published: ${notif.title}` },
    ]);
  };

  const handleNavigateLiveOutages = () => {
    setCurrentScreen('landing');
    setTimeout(() => {
      const el = document.getElementById('map-monitor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleUpdateIncident = (updated) => {
    setIncidentsData((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  const handleAssignCrew = (incidentId, crewId) => {
    const inc = incidentsData[incidentId];
    if (!inc) return;

    setCrewsData((prev) =>
      prev.map((c) => (c.id === crewId ? { ...c, status: 'Dispatched', assignedIncident: inc.incidentId } : c))
    );
  };

  console.log('[PowerWatch App] Rendering screen:', currentScreen);

  let content;
  if (currentScreen === 'signin') {
    content = (
      <SignInScreen
        onNavigateHome={() => setCurrentScreen('landing')}
        onNavigateSignUp={() => setCurrentScreen('signup')}
        onNavigateCitizenDemo={() => setCurrentScreen('citizen-demo')}
        onNavigateDepartmentDemo={() => setCurrentScreen('department-demo')}
      />
    );
  } else if (currentScreen === 'signup') {
    content = (
      <SignUpScreen
        onNavigateHome={() => setCurrentScreen('landing')}
        onNavigateSignIn={() => setCurrentScreen('signin')}
      />
    );
  } else if (currentScreen === 'citizen-demo') {
    content = (
      <CitizenDashboard
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onViewIncidentDetail={(id) => {
          setSelectedIncidentId(id);
          setCurrentScreen('incident-detail');
        }}
        onNavigateHome={() => setCurrentScreen('signin')}
        onNavigateReportOutage={() => setCurrentScreen('report-outage')}
        onNavigateLiveOutages={handleNavigateLiveOutages}
      />
    );
  } else if (currentScreen === 'department-demo') {
    content = (
      <DepartmentDashboard
        incidentsData={incidentsData}
        crewsData={crewsData}
        onUpdateIncident={handleUpdateIncident}
        onAssignCrew={handleAssignCrew}
        onPublishNotification={handlePublishNotification}
        onNavigateHome={() => setCurrentScreen('signin')}
        onNavigateLiveOutages={handleNavigateLiveOutages}
        onNavigateReportGrouping={() => setCurrentScreen('report-grouping')}
        onViewIncidentDetail={(id) => {
          setSelectedIncidentId(id);
          setCurrentScreen('incident-detail');
        }}
      />
    );
  } else if (currentScreen === 'incident-detail') {
    content = (
      <IncidentDetailScreen
        incidentId={selectedIncidentId}
        incidentsData={incidentsData}
        onBack={handleNavigateLiveOutages}
        onBackToCitizenPortal={() => setCurrentScreen('citizen-demo')}
        onBackToDepartmentPortal={() => setCurrentScreen('department-demo')}
      />
    );
  } else if (currentScreen === 'report-outage') {
    content = (
      <ReportOutageScreen
        onBack={() => setCurrentScreen('landing')}
        onReportSubmitted={(report) => {
          setToasts((prev) => [
            ...prev,
            { id: Date.now(), type: 'success', message: `Report ${report.reportId} logged successfully!` },
          ]);
        }}
      />
    );
  } else if (currentScreen === 'report-grouping') {
    content = (
      <ReportGroupingScreen
        onBack={() => setCurrentScreen('department-demo')}
        onViewIncident={(id) => {
          setSelectedIncidentId(id);
          setCurrentScreen('incident-detail');
        }}
      />
    );
  } else {
    content = (
      <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
        <Header
          onNavigateSignIn={() => setCurrentScreen('signin')}
          onNavigateReportOutage={() => setCurrentScreen('report-outage')}
        />
        <main className="w-full pt-20 bg-background flex-1">
          <Hero />
          <LiveOutages
            onSelectIncidentDetail={(id) => {
              setSelectedIncidentId(id);
              setCurrentScreen('incident-detail');
            }}
          />
          <HowItWorks />
          <CitizensAndTeams />
          <FinalCTA />
        </main>
        <Footer onNavigateSignIn={() => setCurrentScreen('signin')} />
      </div>
    );
  }

  return (
    <>
      {content}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </>
  );
}
