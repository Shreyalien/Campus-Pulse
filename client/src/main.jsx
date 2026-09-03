import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence } from 'framer-motion';
import { getSocket } from './services/socket';
import {
  fetchIssues,
  fetchIssueById,
  createIssue,
  voteIssue,
  appealIssue,
  updateIssue,
  fetchNotifications,
  markNotificationsRead,
  fetchAnalyticsSummary,
  fetchAnalyticsTrends,
  fetchAnalyticsCategories,
  fetchAnalyticsDepartments
} from './services/api';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import IssueDrawer from './components/IssueDrawer';
import NotificationDrawer from './components/NotificationDrawer';
import ObjectionModal from './components/ObjectionModal';
import ReportModal from './components/ReportModal';

import Overview from './pages/Overview';
import Objections from './pages/Objections';
import LiveMap from './pages/LiveMap';
import Reports from './pages/Reports';
import Admin from './pages/Admin';

import './styles.css';

function App() {
  const [currentTab, setTab] = useState('Overview');
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'

  const [issues, setIssues] = useState([]);
  const [summary, setSummary] = useState({});
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isObjectionModalOpen, setObjectionModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const loadAllData = async () => {
    try {
      const [issuesData, sumData, trData, catData, deptData, notifData] = await Promise.all([
        fetchIssues(),
        fetchAnalyticsSummary(),
        fetchAnalyticsTrends(),
        fetchAnalyticsCategories(),
        fetchAnalyticsDepartments(),
        fetchNotifications()
      ]);
      setIssues(issuesData);
      setSummary(sumData);
      setTrends(trData);
      setCategories(catData);
      setDepartments(deptData);
      setNotifications(notifData);
    } catch (err) {
      console.error('Data loading error:', err);
    }
  };

  useEffect(() => {
    loadAllData();

    const socket = getSocket();

    socket.on('issue:new', (newIssue) => {
      setIssues((prev) => [newIssue, ...prev.filter(i => i.id !== newIssue.id)]);
      showToast(`📢 ${newIssue.type === 'student_objection' ? 'New Objection' : 'New Report'}: ${newIssue.title}`);
      fetchAnalyticsSummary().then(setSummary).catch(console.error);
    });

    socket.on('issue:updated', (updated) => {
      setIssues((prev) => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i));
      setSelectedIssue((curr) => (curr && curr.id === updated.id ? { ...curr, ...updated } : curr));
      showToast(`⚡ Ticket #${updated.id} status updated to "${updated.status}"`);
      fetchAnalyticsSummary().then(setSummary).catch(console.error);
    });

    socket.on('objection:voted', ({ issue_id, upvotes }) => {
      setIssues((prev) => prev.map(i => i.id === issue_id ? { ...i, upvotes } : i));
      setSelectedIssue((curr) => (curr && curr.id === issue_id ? { ...curr, upvotes } : curr));
    });

    socket.on('notification:new', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off('issue:new');
      socket.off('issue:updated');
      socket.off('objection:voted');
      socket.off('notification:new');
    };
  }, []);

  const handleSelectIssue = async (issue) => {
    try {
      const full = await fetchIssueById(issue.id);
      setSelectedIssue(full);
    } catch (err) {
      setSelectedIssue(issue);
    }
  };

  const handleVote = async (issueId) => {
    try {
      const res = await voteIssue(issueId, userRole === 'admin' ? 'OP-001' : '251-15-467');
      setIssues((prev) => prev.map(i => i.id === issueId ? { ...i, upvotes: res.upvotes, has_voted: res.has_voted } : i));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue((curr) => ({ ...curr, upvotes: res.upvotes, has_voted: res.has_voted }));
      }
      showToast(res.has_voted ? '✓ Objection supported' : 'Vote removed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateObjection = async (data) => {
    try {
      const created = await createIssue({
        ...data,
        reporter_name: userRole === 'admin' ? 'Admin Staff' : 'Shreya Golder (CR)'
      });
      showToast('✓ Formal objection lodged and submitted for triage');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReport = async (data) => {
    try {
      await createIssue(data);
      showToast('✓ Incident report submitted');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppeal = async (issueId, appealReason) => {
    try {
      const updated = await appealIssue(issueId, appealReason, userRole === 'admin' ? 'Faculty Member' : 'Shreya Golder');
      setSelectedIssue(updated);
      setIssues((prev) => prev.map(i => i.id === issueId ? updated : i));
      showToast('✓ Appeal submitted to University Syndicate');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (issueId, updateData) => {
    try {
      const updated = await updateIssue(issueId, {
        ...updateData,
        author_name: userRole === 'admin' ? 'Engr. M. Rafiq (Ops Lead)' : 'Student Desk'
      });
      setSelectedIssue(updated);
      setIssues((prev) => prev.map(i => i.id === issueId ? updated : i));
      showToast(`✓ Case #${issueId} updated`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async () => {
    try {
      await markNotificationsRead();
      setNotifications((prev) => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifs = notifications.filter(n => !n.is_read).length;
  const objectionCount = issues.filter(i => (i.type === 'student_objection' || i.type === 'petition') && i.status !== 'Resolved').length;

  const searchedIssues = useMemo(() => {
    if (!searchTerm.trim()) return issues;
    const q = searchTerm.toLowerCase();
    return issues.filter(i =>
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.location?.toLowerCase().includes(q)
    );
  }, [issues, searchTerm]);

  return (
    <div className="app-shell">
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        userRole={userRole}
        setUserRole={setUserRole}
        objectionCount={objectionCount}
        openObjectionModal={() => setObjectionModalOpen(true)}
        openReportModal={() => setReportModalOpen(true)}
      />

      <div className="main-content-area">
        <Navbar
          currentTab={currentTab}
          userRole={userRole}
          notifications={notifications}
          unreadCount={unreadNotifs}
          onOpenNotifications={() => setNotificationOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="content-body">
          {currentTab === 'Overview' && (
            <Overview
              summary={summary}
              trends={trends}
              categories={categories}
              issues={searchedIssues}
              onSelectIssue={handleSelectIssue}
              onOpenObjectionModal={() => setObjectionModalOpen(true)}
              onNavigateTab={setTab}
            />
          )}

          {currentTab === 'Objections' && (
            <Objections
              issues={searchedIssues}
              onSelectIssue={handleSelectIssue}
              onVote={handleVote}
              onOpenObjectionModal={() => setObjectionModalOpen(true)}
            />
          )}

          {currentTab === 'Live Map' && (
            <LiveMap
              issues={searchedIssues}
              onSelectIssue={handleSelectIssue}
            />
          )}

          {currentTab === 'Reports' && (
            <Reports
              issues={searchedIssues}
              onSelectIssue={handleSelectIssue}
              onVote={handleVote}
            />
          )}

          {currentTab === 'Admin' && (
            <Admin
              issues={searchedIssues}
              summary={summary}
              departments={departments}
              onSelectIssue={handleSelectIssue}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </main>
      </div>

      {/* Slide-out Investigation Drawer */}
      <AnimatePresence>
        {selectedIssue && (
          <IssueDrawer
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onVote={handleVote}
            onAppeal={handleAppeal}
            onUpdateStatus={handleUpdateStatus}
            userRole={userRole}
          />
        )}
      </AnimatePresence>

      {/* Notifications Drawer */}
      <AnimatePresence>
        {isNotificationOpen && (
          <NotificationDrawer
            isOpen={isNotificationOpen}
            onClose={() => setNotificationOpen(false)}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onSelectIssue={(id) => {
              const item = issues.find(i => i.id === id);
              if (item) handleSelectIssue(item);
            }}
          />
        )}
      </AnimatePresence>

      {/* Formal Student Objection Modal */}
      <AnimatePresence>
        {isObjectionModalOpen && (
          <ObjectionModal
            isOpen={isObjectionModalOpen}
            onClose={() => setObjectionModalOpen(false)}
            onSubmit={handleCreateObjection}
          />
        )}
      </AnimatePresence>

      {/* Quick Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setReportModalOpen(false)}
            onSubmit={handleCreateReport}
          />
        )}
      </AnimatePresence>

      {/* Live Toast Notice */}
      <AnimatePresence>
        {toast && (
          <div className="live-toast-banner">
            <span>{toast}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
