import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
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
import { OutageHistoryScreen } from './components/OutageHistoryScreen';
import { VerificationSuccessScreen } from './components/VerificationSuccessScreen';
import { ToastContainer } from './components/ToastContainer';
import { initialIncidentsData, initialCrewsData } from './data/mockIncidentsStore';
import { initialNotificationsData } from './data/mockNotificationsStore';

function checkVerificationCallback() {
  const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
  const search = typeof window !== 'undefined' ? window.location.search || '' : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname || '' : '';

  const isError =
    hash.includes('error=') ||
    hash.includes('error_code=') ||
    search.includes('error=') ||
    search.includes('error_code=');

  if (isError) {
    const rawParams = hash.includes('error=') ? hash.substring(1) : search.substring(1);
    const params = new URLSearchParams(rawParams);
    const errorDesc = params.get('error_description') || 'The verification link may have expired or is invalid.';
    return { screen: 'verification-success', isSuccess: false, errorMessage: errorDesc };
  }

  const isSuccess =
    pathname.endsWith('/verify') ||
    hash.includes('type=signup') ||
    hash.includes('type=email_verification') ||
    hash.includes('type=recovery') ||
    hash.includes('access_token=') ||
    search.includes('code=') ||
    search.includes('type=signup') ||
    search.includes('type=email_verification');

  if (isSuccess) {
    return { screen: 'verification-success', isSuccess: true, errorMessage: '' };
  }

  return null;
}

export default function App() {
  const initialVerification = checkVerificationCallback();
  const [currentScreen, setCurrentScreen] = useState(initialVerification?.screen || 'landing');
  const [previousScreen, setPreviousScreen] = useState('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState('west-district');
  const [incidentsData, setIncidentsData] = useState(initialIncidentsData);
  const [crewsData, setCrewsData] = useState(initialCrewsData);
  const [notifications, setNotifications] = useState(initialNotificationsData);
  const [toasts, setToasts] = useState([]);
  
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [verificationState] = useState({
    isSuccess: initialVerification ? initialVerification.isSuccess : true,
    errorMessage: initialVerification ? initialVerification.errorMessage : '',
  });

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[PowerWatch] Error fetching profile:', error.message);
      }

      let activeProfile = data;

      // Self-healing step: if profile does not exist, create it with user's authenticated JWT
      if (!activeProfile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === userId) {
          const fullNameFromMeta = user.user_metadata?.full_name || '';
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: user.id,
                full_name: fullNameFromMeta,
              },
              { onConflict: 'id' }
            )
            .select('*')
            .maybeSingle();

          if (createError) {
            console.error('[PowerWatch] Self-healing profile creation failed:', createError.message);
          } else {
            console.log('[PowerWatch] Missing profile created successfully for user:', user.id);
            activeProfile = createdProfile;
          }
        }
      }

      setUserProfile(activeProfile || { id: userId, role: 'citizen' });

      // Direct to normal Home page (landing) or Department Portal based on profile role after sign-in
      const role = activeProfile?.role || 'citizen';
      setCurrentScreen((prev) => {
        if (prev === 'signin' || prev === 'signup') {
          return role === 'officer' || role === 'department' || role === 'utility' || role === 'admin'
            ? 'department-demo'
            : 'landing';
        }
        return prev;
      });
    } catch (err) {
      console.error('[PowerWatch] Exception in fetchUserProfile:', err);
    }
  };

  useEffect(() => {
    // 1. Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[PowerWatch] Auth state changed:', event, session?.user?.id);
      setSession(session);

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setCurrentScreen('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), type: 'info', message: 'Signed out successfully.' },
      ]);
    } catch (err) {
      console.error('[PowerWatch] Sign out error:', err);
    }
  };

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
  } else if (currentScreen === 'verification-success') {
    content = (
      <VerificationSuccessScreen
        isSuccess={verificationState.isSuccess}
        errorMessage={verificationState.errorMessage}
        onNavigateSignIn={() => {
          if (window.location.hash || window.location.search) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          setCurrentScreen('signin');
        }}
        onNavigateSignUp={() => {
          if (window.location.hash || window.location.search) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          setCurrentScreen('signup');
        }}
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
          setPreviousScreen('citizen-demo');
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
          setPreviousScreen('department-demo');
          setCurrentScreen('incident-detail');
        }}
      />
    );
  } else if (currentScreen === 'incident-detail') {
    content = (
      <IncidentDetailScreen
        incidentId={selectedIncidentId}
        incidentsData={incidentsData}
        onBack={() => {
          if (previousScreen === 'outage-history') {
            setCurrentScreen('outage-history');
          } else {
            handleNavigateLiveOutages();
          }
        }}
        onBackToOutageHistory={() => setCurrentScreen('outage-history')}
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
          setPreviousScreen('report-grouping');
          setCurrentScreen('incident-detail');
        }}
      />
    );
  } else if (currentScreen === 'outage-history') {
    content = (
      <OutageHistoryScreen
        incidentsData={incidentsData}
        onNavigateHome={() => setCurrentScreen('landing')}
        onNavigateLiveOutages={handleNavigateLiveOutages}
        onNavigateSignIn={() => setCurrentScreen('signin')}
        onNavigateReportOutage={() => setCurrentScreen('report-outage')}
        onViewIncidentDetail={(id) => {
          setSelectedIncidentId(id);
          setPreviousScreen('outage-history');
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
          onNavigateOutageHistory={() => setCurrentScreen('outage-history')}
          onNavigateHome={() => setCurrentScreen('landing')}
          onNavigateLiveOutages={handleNavigateLiveOutages}
          currentScreen={currentScreen}
          session={session}
          userProfile={userProfile}
          onSignOut={handleSignOut}
        />
        <main className="w-full pt-20 bg-background flex-1">
          <Hero />
          <LiveOutages
            onSelectIncidentDetail={(id) => {
              setSelectedIncidentId(id);
              setPreviousScreen('landing');
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

