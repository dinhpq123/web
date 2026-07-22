// ── HADIWA IOC — ONBOARDING & HELP CONFIGURATION ───────────────────────────
// Edit this file to tune onboarding behaviour without touching application code.

window.OB_CONFIG = {
    // Number of visits per page during which the chatbot shows a "Help for this page"
    // suggestion chip as the FIRST suggestion. Set to 0 to disable.
    chatbotHelpVisits: 5,

    // Automatically launch the guided tour on first visit to each page.
    // Set to false to disable auto-launch (tour can still be triggered manually).
    tourAutoStart: true,

    // Show the full dashboard tour (menu walkthrough) when the user logs in for
    // the very first time (localStorage key 'qwc_ob_first_login' not set).
    dashboardTourOnFirstLogin: true,

    // Number of milliseconds to wait after page render before starting the tour.
    tourStartDelay: 700,

    // Per-page metadata: title shown in chatbot help reply, and links to video / docs.
    // videoUrl / docUrl are relative to the app root.
    pages: {
        dashboard: { title: 'Dashboard Tổng Quan', videoUrl: 'docs/videos/dashboard.mp4', docUrl: 'docs/documentation.html#dashboard' },
        gis: { title: 'Bản đồ GIS', videoUrl: 'docs/videos/gis.mp4', docUrl: 'docs/documentation.html#gis' },
        incidents: { title: 'Sự cố & Lệnh Công Tác', videoUrl: 'docs/videos/incidents.mp4', docUrl: 'docs/documentation.html#incidents' },
        nrw: { title: 'NRW – Thất Thoát', videoUrl: 'docs/videos/nrw.mp4', docUrl: 'docs/documentation.html#nrw' },
        plants: { title: 'Quản lý Nhà Máy', videoUrl: 'docs/videos/plants.mp4', docUrl: 'docs/documentation.html#plants' },
        scada: { title: 'SCADA / RTU', videoUrl: 'docs/videos/scada.mp4', docUrl: 'docs/documentation.html#scada' },
        quality: { title: 'Chất Lượng Nước', videoUrl: 'docs/videos/quality.mp4', docUrl: 'docs/documentation.html#quality' },
        lims: { title: 'LIMS Phòng Thí Nghiệm', videoUrl: 'docs/videos/lims.mp4', docUrl: 'docs/documentation.html#lims' },
        alerts: { title: 'Cảnh Báo Hệ Thống', videoUrl: 'docs/videos/alerts.mp4', docUrl: 'docs/documentation.html#alerts' },
        camera: { title: 'Camera / CCTV', videoUrl: 'docs/videos/camera.mp4', docUrl: 'docs/documentation.html#camera' },
        videowall: { title: 'Video Wall', videoUrl: 'docs/videos/videowall.mp4', docUrl: 'docs/documentation.html#videowall' },
        business: { title: 'Kinh Doanh Tổng Quan', videoUrl: 'docs/videos/business.mp4', docUrl: 'docs/documentation.html#business' },
        business_history: { title: 'Lịch Sử Kinh Doanh', videoUrl: 'docs/videos/biz_history.mp4', docUrl: 'docs/documentation.html#business_history' },
        business_overview: { title: 'Báo Cáo Kinh Doanh', videoUrl: 'docs/videos/biz_overview.mp4', docUrl: 'docs/documentation.html#business_overview' },
        callcenter: { title: 'Tổng Đài CSKH', videoUrl: 'docs/videos/callcenter.mp4', docUrl: 'docs/documentation.html#callcenter' },
        customers: { title: 'Quản lý Khách Hàng', videoUrl: 'docs/videos/customers.mp4', docUrl: 'docs/documentation.html#customers' },
        scheduler: { title: 'Lịch & Phân Công', videoUrl: 'docs/videos/scheduler.mp4', docUrl: 'docs/documentation.html#scheduler' },
        assets: { title: 'Vật Tư & Thiết Bị', videoUrl: 'docs/videos/assets.mp4', docUrl: 'docs/documentation.html#assets' },
        hrm: { title: 'Nhân Sự (HRM)', videoUrl: 'docs/videos/hrm.mp4', docUrl: 'docs/documentation.html#hrm' },
        datahub: { title: 'Data Hub & AI KPI', videoUrl: 'docs/videos/datahub.mp4', docUrl: 'docs/documentation.html#datahub' },
        dieuhanh: { title: 'Điều Hành & Phê Duyệt', videoUrl: 'docs/videos/dieuhanh.mp4', docUrl: 'docs/documentation.html#dieuhanh' },
        log: { title: 'Nhật Ký Hệ Thống', videoUrl: 'docs/videos/log.mp4', docUrl: 'docs/documentation.html#log' },
        chatbot: { title: 'AI Trợ Lý Hadiwa', videoUrl: 'docs/videos/chatbot.mp4', docUrl: 'docs/documentation.html#chatbot' },
        settings: { title: 'Cài Đặt Hệ Thống', videoUrl: 'docs/videos/settings.mp4', docUrl: 'docs/documentation.html#settings' },
    }
};
