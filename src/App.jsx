import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { profileApi } from './lib/apiClient';
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

function parseRouteFromLocation() {
  if (typeof window === 'undefined') return { screen: 'landing', section: 'home' };

  const verification = checkVerificationCallback();
  if (verification) {
    return { screen: 'verification-success', isVerification: true, verification };
  }

  const hash = window.location.hash || '';
  const pathname = window.location.pathname || '';

  let routePath = '';
  if (hash) {
    routePath = hash.replace(/^#\/?/, '');
  } else if (pathname && pathname !== '/') {
    routePath = pathname.replace(/^\//, '');
  }

  // Handle Incident Detail: incident/:id or incident-detail/:id
  if (routePath.startsWith('incident/')) {
    const incidentId = routePath.replace('incident/', '').split('?')[0].split('/')[0];
    return { screen: 'incident-detail', incidentId: decodeURIComponent(incidentId) };
  }
  if (routePath.startsWith('incident-detail/')) {
    const incidentId = routePath.replace('incident-detail/', '').split('?')[0].split('/')[0];
    return { screen: 'incident-detail', incidentId: decodeURIComponent(incidentId) };
  }

  if (routePath === 'outage-history') return { screen: 'outage-history' };
  if (routePath === 'report-outage') return { screen: 'report-outage' };
  if (routePath === 'signin') return { screen: 'signin' };
  if (routePath === 'signup') return { screen: 'signup' };
  if (routePath === 'citizen-demo') return { screen: 'citizen-demo' };
  if (routePath === 'department-demo') return { screen: 'department-demo' };
  if (routePath === 'report-grouping') return { screen: 'report-grouping' };
  if (routePath === 'verify') return { screen: 'verification-success' };

  if (routePath === 'map-monitor' || routePath === 'live-outages') {
    return { screen: 'landing', section: 'map-monitor' };
  }
  if (routePath === 'how-it-works') {
    return { screen: 'landing', section: 'how-it-works' };
  }
  if (routePath === 'citizens-and-teams') {
    return { screen: 'landing', section: 'citizens-and-teams' };
  }

  return { screen: 'landing', section: 'home' };
}

function getHashForRoute(screen, incidentId, section) {
  switch (screen) {
    case 'incident-detail':
      return `#incident/${incidentId || 'west-district'}`;
    case 'outage-history':
      return '#outage-history';
    case 'report-outage':
      return '#report-outage';
    case 'signin':
      return '#signin';
    case 'signup':
      return '#signup';
    case 'citizen-demo':
      return '#citizen-demo';
    case 'department-demo':
      return '#department-demo';
    case 'report-grouping':
      return '#report-grouping';
    case 'verification-success':
      return '#verify';
    case 'landing':
    default:
      if (section && section !== 'home') {
        return `#${section}`;
      }
      return '#';
  }
}

export default function App() {
  const initialVerification = checkVerificationCallback();
  const initialRoute = parseRouteFromLocation();

  const [currentScreen, setCurrentScreen] = useState(
    initialVerification?.screen || initialRoute.screen || 'landing'
  );
  const [previousScreen, setPreviousScreen] = useState('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState(
    initialRoute.incidentId || 'west-district'
  );
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

  const navigateTo = (screen, options = {}) => {
    const { incidentId = null, section = null, replace = false } = options;
    const targetIncidentId = incidentId || (screen === 'incident-detail' ? selectedIncidentId : null);
    const targetHash = getHashForRoute(screen, targetIncidentId, section);

    // If opening an incident from landing when no hash is in URL yet,
    // replace current entry with #map-monitor so browser Back returns to Live Outages instead of skipping it:
    if (
      screen === 'incident-detail' &&
      currentScreen === 'landing' &&
      (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/')
    ) {
      window.history.replaceState(
        { screen: 'landing', section: 'map-monitor', powerWatchInternal: true },
        '',
        '#map-monitor'
      );
    }

    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    if (targetIncidentId) {
      setSelectedIncidentId(targetIncidentId);
    }

    const stateObj = {
      screen,
      incidentId: targetIncidentId,
      section,
      powerWatchInternal: true,
    };

    const currentHash = window.location.hash || '';
    if (currentHash !== targetHash || window.history.state?.screen !== screen) {
      if (replace) {
        window.history.replaceState(stateObj, '', targetHash || window.location.pathname);
      } else {
        window.history.pushState(stateObj, '', targetHash || window.location.pathname);
      }
    }

    if (screen === 'landing') {
      if (section && section !== 'home') {
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  const handleBackFromIncident = () => {
    navigateTo('landing', { section: 'map-monitor' });
  };

  // Initialize initial history entry state without pushing extra entry
  useEffect(() => {
    const currentHash = window.location.hash || '';
    const currentRoute = parseRouteFromLocation();
    const initialState = {
      screen: currentRoute.screen,
      incidentId: currentRoute.incidentId || null,
      section: currentRoute.section || null,
      powerWatchInternal: true,
    };

    window.history.replaceState(
      initialState,
      '',
      currentHash || window.location.pathname || '#'
    );

    if (currentRoute.screen === 'landing' && currentRoute.section && currentRoute.section !== 'home') {
      setTimeout(() => {
        const el = document.getElementById(currentRoute.section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // Listen to browser Back and Forward navigation events
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation();
      console.log('[PowerWatch Navigation] Popstate/Hashchange triggered:', window.location.hash, route);

      setCurrentScreen(route.screen);
      if (route.incidentId) {
        setSelectedIncidentId(route.incidentId);
      }

      if (route.screen === 'landing') {
        if (route.section && route.section !== 'home') {
          setTimeout(() => {
            const el = document.getElementById(route.section);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0 });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      let activeProfile = null;

      try {
        // Primary profile retrieval: FastAPI GET /api/profile/me
        activeProfile = await profileApi.getMyProfile();
        console.log('[PowerWatch] Profile fetched successfully via FastAPI:', activeProfile?.id);
      } catch (apiErr) {
        console.warn('[PowerWatch] FastAPI profile fetch notice:', apiErr.message);

        // Self-healing step: if profile does not exist (404/not found), create it with user's authenticated JWT
        if (apiErr.status === 404 || apiErr.message?.includes('404') || apiErr.message?.includes('not found')) {
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
      }

      setUserProfile(activeProfile || { id: userId, role: 'citizen' });

      // Direct to normal Home page (landing) or Department Portal based on profile role after sign-in
      const role = activeProfile?.role || 'citizen';
      setCurrentScreen((prev) => {
        if (prev === 'signin' || prev === 'signup') {
          const nextScreen = role === 'officer' || role === 'department' || role === 'utility' || role === 'admin'
            ? 'department-demo'
            : 'landing';
          window.history.replaceState(
            { screen: nextScreen, powerWatchInternal: true },
            '',
            getHashForRoute(nextScreen)
          );
          return nextScreen;
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
        window.history.replaceState(
          { screen: 'landing', powerWatchInternal: true },
          '',
          '#'
        );
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
    navigateTo('landing', { section: 'map-monitor' });
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
        onNavigateHome={() => navigateTo('landing')}
        onNavigateSignUp={() => navigateTo('signup')}
        onNavigateCitizenDemo={() => navigateTo('citizen-demo')}
        onNavigateDepartmentDemo={() => navigateTo('department-demo')}
      />
    );
  } else if (currentScreen === 'signup') {
    content = (
      <SignUpScreen
        onNavigateHome={() => navigateTo('landing')}
        onNavigateSignIn={() => navigateTo('signin')}
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
          navigateTo('signin');
        }}
        onNavigateSignUp={() => {
          if (window.location.hash || window.location.search) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          navigateTo('signup');
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
          navigateTo('incident-detail', { incidentId: id });
        }}
        onNavigateHome={() => navigateTo('signin')}
        onNavigateReportOutage={() => navigateTo('report-outage')}
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
        onNavigateHome={() => navigateTo('signin')}
        onNavigateLiveOutages={handleNavigateLiveOutages}
        onNavigateReportGrouping={() => navigateTo('report-grouping')}
        onViewIncidentDetail={(id) => {
          navigateTo('incident-detail', { incidentId: id });
        }}
      />
    );
  } else if (currentScreen === 'incident-detail') {
    content = (
      <IncidentDetailScreen
        incidentId={selectedIncidentId}
        incidentsData={incidentsData}
        onBack={handleBackFromIncident}
        onBackToOutageHistory={() => navigateTo('outage-history')}
        onBackToCitizenPortal={() => navigateTo('citizen-demo')}
        onBackToDepartmentPortal={() => navigateTo('department-demo')}
      />
    );
  } else if (currentScreen === 'report-outage') {
    content = (
      <ReportOutageScreen
        onBack={() => {
          if (window.history.length > 1 && window.location.hash === '#report-outage') {
            window.history.back();
          } else {
            navigateTo('landing');
          }
        }}
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
        onBack={() => {
          if (window.history.length > 1 && window.location.hash === '#report-grouping') {
            window.history.back();
          } else {
            navigateTo('department-demo');
          }
        }}
        onViewIncident={(id) => {
          navigateTo('incident-detail', { incidentId: id });
        }}
      />
    );
  } else if (currentScreen === 'outage-history') {
    content = (
      <OutageHistoryScreen
        incidentsData={incidentsData}
        onNavigateHome={() => navigateTo('landing', { section: 'home' })}
        onNavigateLiveOutages={handleNavigateLiveOutages}
        onNavigateSignIn={() => navigateTo('signin')}
        onNavigateReportOutage={() => navigateTo('report-outage')}
        onViewIncidentDetail={(id) => {
          navigateTo('incident-detail', { incidentId: id });
        }}
      />
    );
  } else {
    content = (
      <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
        <Header
          onNavigateSignIn={() => navigateTo('signin')}
          onNavigateReportOutage={() => navigateTo('report-outage')}
          onNavigateOutageHistory={() => navigateTo('outage-history')}
          onNavigateHome={() => navigateTo('landing', { section: 'home' })}
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
              navigateTo('incident-detail', { incidentId: id });
            }}
          />
          <HowItWorks />
          <CitizensAndTeams />
          <FinalCTA />
        </main>
        <Footer
          onNavigateSignIn={() => navigateTo('signin')}
          onNavigateOutageHistory={() => navigateTo('outage-history')}
          onNavigateHome={() => navigateTo('landing', { section: 'home' })}
          onNavigateLiveOutages={handleNavigateLiveOutages}
        />
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

