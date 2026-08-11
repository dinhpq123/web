// ============================================================
// Hadiwa IOC — Role-Based Access Control (RBAC)
// Chi cục Thủy lợi — Phòng chống Thiên tai
// ============================================================

// ── Role constants ─────────────────────────────────────────
const ROLES = {
    SUPERADMIN: 'SUPERADMIN',
    SYSADMIN: 'SYSADMIN',
    CHI_CUC_TRUONG: 'CHI_CUC_TRUONG',
    DIEU_HANH: 'DIEU_HANH',
    KY_THUAT: 'KY_THUAT',
    QUAN_LY_DE: 'QUAN_LY_DE',
    HR: 'HR',
    VIEWER: 'VIEWER',
};

// ── Mock users (demo) ──────────────────────────────────────
const MOCK_USERS = [
    { id: 0, email: 'admin@hadiwa.vn', password: 'admin123', role: 'SYSADMIN', name: 'Nguyễn Quản Trị', title: 'Quản trị viên', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>', badge: 'badge-role' },
    { id: 1, email: 'superadmin@hadiwa.vn', password: 'super123', role: 'SUPERADMIN', name: 'Nguyễn Siêu Quản Trị', title: 'Super Admin', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', badge: 'badge-role' },
    { id: 2, email: 'chicuctruong@hadiwa.vn', password: '123456', role: 'CHI_CUC_TRUONG', name: 'Nguyễn Văn Sơn', title: 'Chi cục trưởng TT-PCTT', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>', badge: 'badge-role' },
    { id: 3, email: 'dieuhanh@hadiwa.vn', password: '123456', role: 'DIEU_HANH', name: 'Trần Thị Hương', title: 'Điều hành PCTT', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>', badge: 'badge-role' },
    { id: 4, email: 'kythuat@hadiwa.vn', password: '123456', role: 'KY_THUAT', name: 'Lê Hùng Cường', title: 'Kỹ thuật Thủy lợi', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>', badge: 'badge-blue' },
    { id: 5, email: 'quanlyde@hadiwa.vn', password: '123456', role: 'QUAN_LY_DE', name: 'Phạm Thị Ngọc', title: 'Quản lý Đê điều', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', badge: 'badge-role' },
    { id: 6, email: 'nhansu@hadiwa.vn', password: '123456', role: 'HR', name: 'Vũ Thị Mai', title: 'Tổ chức – Hành chính', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', badge: 'badge-role' },
    { id: 7, email: 'viewer@hadiwa.vn', password: '123456', role: 'VIEWER', name: 'Nguyễn Thị Vân', title: 'Thanh tra – Pháp chế', avatar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', badge: 'badge-gray' },
];

// ── Role config: which sidebar pages each role can access ──
const ROLE_CONFIG = {
    SUPERADMIN: {
        fullSidebar: true,
        dashboard: true, dieuhanh: true, videowall: true, camera: true, gis: true,
        irrigationAssets: true, dikeManagement: true, dikePermit: true, scheduler: true,
        pcttDocuments: true, fourOnSite: true, pcttCommand: true, pcttFund: true,
        communityReports: true, iotMonitor: true, earlyWarning: true, weatherBulletin: true,
        commsDevices: true, reports: true, pcttMedia: true, aiagent: true, chatbot: true,
        datahub: true, hrm: true, log: true, settings: true, workflows: true,
        settingsTabs: ['system', 'security', 'roles', 'dashboard', 'notifications', 'integrations', 'ui'],
    },
    SYSADMIN: {
        dashboard: 'full', dieuhanh: 'full', videowall: 'full', gis: 'full', camera: 'full',
        iotMonitor: 'full', earlyWarning: 'full', weatherBulletin: 'full', scheduler: 'full',
        irrigationAssets: 'full', dikeManagement: 'full', dikePermit: 'full',
        pcttDocuments: 'full', fourOnSite: 'full', pcttCommand: 'full', pcttFund: 'full',
        communityReports: 'full',
        reports: 'full', pcttMedia: 'full', aiagent: 'full', chatbot: 'full', datahub: 'full',
        hrm: 'full', log: 'full', settings: 'full',
        settingsTabs: ['system', 'security', 'roles', 'dashboard', 'notifications', 'integrations', 'ui'],
    },
    CHI_CUC_TRUONG: {
        dashboard: 'view', dieuhanh: 'full', videowall: 'view', gis: 'view', camera: 'view',
        iotMonitor: 'view', earlyWarning: 'view', weatherBulletin: 'full', scheduler: 'view',
        irrigationAssets: 'view', dikeManagement: 'view', dikePermit: 'view',
        pcttDocuments: 'full', fourOnSite: 'view', pcttCommand: 'full', pcttFund: 'view',
        communityReports: 'view',
        reports: 'full', pcttMedia: 'full', aiagent: 'view', chatbot: 'view', datahub: 'view',
        hrm: 'view', log: false, settings: 'view',
        settingsTabs: ['dashboard'],
    },
    DIEU_HANH: {
        dashboard: 'view', dieuhanh: 'full', videowall: 'view', gis: 'view', camera: 'view',
        iotMonitor: 'full', earlyWarning: 'full', weatherBulletin: 'full', scheduler: 'full',
        irrigationAssets: 'view', dikeManagement: 'view', dikePermit: 'view',
        pcttDocuments: 'edit', fourOnSite: 'full', pcttCommand: 'full', pcttFund: 'edit',
        communityReports: 'full',
        reports: 'view', pcttMedia: 'edit', aiagent: 'view', chatbot: 'view', datahub: false,
        hrm: false, log: false, settings: false,
        settingsTabs: [],
    },
    KY_THUAT: {
        dashboard: 'view', dieuhanh: 'view', videowall: 'view', gis: 'edit', camera: 'view',
        iotMonitor: 'full', earlyWarning: 'edit', weatherBulletin: 'view', scheduler: 'full',
        irrigationAssets: 'full', dikeManagement: 'edit', dikePermit: 'edit',
        pcttDocuments: 'view', fourOnSite: 'view', pcttCommand: 'view', pcttFund: false,
        communityReports: 'edit',
        reports: 'view', pcttMedia: 'view', aiagent: 'view', chatbot: 'view', datahub: false,
        hrm: false, log: false, settings: false,
        settingsTabs: [],
    },
    QUAN_LY_DE: {
        dashboard: 'view', dieuhanh: 'view', videowall: false, gis: 'view', camera: 'view',
        iotMonitor: 'view', earlyWarning: 'view', weatherBulletin: 'view', scheduler: 'view',
        irrigationAssets: 'edit', dikeManagement: 'full', dikePermit: 'full',
        pcttDocuments: 'view', fourOnSite: 'view', pcttCommand: 'view', pcttFund: false,
        communityReports: 'view',
        reports: 'view', pcttMedia: 'view', aiagent: false, chatbot: 'view', datahub: false,
        hrm: false, log: false, settings: false,
        settingsTabs: [],
    },
    HR: {
        dashboard: 'view', dieuhanh: false, videowall: false, gis: false, camera: false,
        iotMonitor: false, earlyWarning: false, weatherBulletin: false, scheduler: false,
        irrigationAssets: false, dikeManagement: false, dikePermit: false,
        pcttDocuments: false, fourOnSite: false, pcttCommand: false, pcttFund: false,
        communityReports: false,
        reports: 'view', pcttMedia: 'view', aiagent: false, chatbot: 'view', datahub: false,
        hrm: 'full', log: false, settings: false,
        settingsTabs: [],
    },
    VIEWER: {
        dashboard: 'view', dieuhanh: false, videowall: false, gis: 'view', camera: false,
        iotMonitor: false, earlyWarning: false, weatherBulletin: 'view', scheduler: false,
        irrigationAssets: 'view', dikeManagement: 'view', dikePermit: false,
        pcttDocuments: 'view', fourOnSite: false, pcttCommand: false, pcttFund: false,
        communityReports: 'view',
        reports: 'view', pcttMedia: 'view', aiagent: false, chatbot: 'view', datahub: false,
        hrm: false, log: false, settings: false,
        settingsTabs: [],
    },
};

// Role display labels
const ROLE_LABELS = {
    SUPERADMIN: 'Super Admin',
    SYSADMIN: 'Quản trị hệ thống',
    CHI_CUC_TRUONG: 'Chi cục trưởng',
    DIEU_HANH: 'Điều hành PCTT',
    KY_THUAT: 'Kỹ thuật thủy lợi',
    QUAN_LY_DE: 'Quản lý đê điều',
    HR: 'Nhân sự',
    VIEWER: 'Giám sát viên',
};

// Role badge colours
const ROLE_BADGES = {
    SUPERADMIN: 'badge-role',
    SYSADMIN: 'badge-role', CHI_CUC_TRUONG: 'badge-role', DIEU_HANH: 'badge-role',
    KY_THUAT: 'badge-role', QUAN_LY_DE: 'badge-role', HR: 'badge-role', VIEWER: 'badge-gray',
};

// ── Helpers ────────────────────────────────────────────────
function getCurrentUser() {
    try {
        const u = localStorage.getItem('ioc_user');
        return u ? JSON.parse(u) : null;
    } catch { return null; }
}

function setCurrentUser(user) {
    localStorage.setItem('ioc_user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('ioc_user');
    window.location.href = 'login.html';
}

function moduleAccess(moduleKey) {
    const user = getCurrentUser();
    if (!user) return false;
    return ROLE_CONFIG[user.role]?.[moduleKey] ?? false;
}

function canView(moduleKey) { return !!moduleAccess(moduleKey); }

function canEdit(moduleKey) {
    const lvl = moduleAccess(moduleKey);
    return lvl === 'edit' || lvl === 'full';
}

function canManage(moduleKey) { return moduleAccess(moduleKey) === 'full'; }

function allowedSettingsTabs() {
    const user = getCurrentUser();
    if (!user) return [];
    const rbacTabs = ROLE_CONFIG[user.role]?.settingsTabs ?? [];
    // Intersect with config-level tab visibility (isTabVisible from config.js)
    if (typeof isTabVisible === 'function') {
        return rbacTabs.filter(tabId => isTabVisible('settings', tabId));
    }
    return rbacTabs;
}

function requireAuth() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
