import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Lock,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  AlertCircle,
  Copy,
  Check,
  User,
  LogOut,
  KeyRound,
  ClipboardList,
  LifeBuoy,
  Send,
  ChevronDown
} from 'lucide-react';
import type { Order, OrderStatus, AuthUser } from '../types';
import { api } from '../services/api';
import { translations, type Language } from '../utils/translations';
import { Logo } from './Logo';

interface ClientPortalProps {
  currentUser?: AuthUser | null;
  myOrders?: Order[];
  onOpenLogin: () => void;
  onOpenCreateModal: () => void;
  onOpenRegister?: () => void;
  onOpenProfile?: () => void;
  onOpenSupport?: () => void;
  onLogout?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  currentUser,
  myOrders = [],
  onOpenLogin,
  onOpenCreateModal,
  onOpenRegister,
  onOpenProfile,
  onOpenSupport,
  onLogout
}) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('repairhub_lang') : null;
    return (saved === 'en' || saved === 'ua') ? saved : 'ua';
  });
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const t = translations[lang];

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('repairhub_lang', newLang);
    }
    setIsLangDropdownOpen(false);
  };

  const statusWorkflow: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'NEW', label: t.stNew, desc: t.stNewDesc },
    { key: 'IN_DIAGNOSTICS', label: t.stDiag, desc: t.stDiagDesc },
    { key: 'PENDING_APPROVAL', label: t.stAppr, desc: t.stApprDesc },
    { key: 'IN_PROGRESS', label: t.stProg, desc: t.stProgDesc },
    { key: 'READY_FOR_PICKUP', label: t.stReady, desc: t.stReadyDesc },
    { key: 'COMPLETED', label: t.stComp, desc: t.stCompDesc },
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Order[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    hero: true,
    cabinet: true
  });

  useEffect(() => {
    const sectionIds = currentUser
      ? ['cabinet', 'hero', 'services', 'workflow', 'about']
      : ['hero', 'services', 'workflow', 'about'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          } else {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: false }));
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentUser]);

  const navSections = [
    ...(currentUser ? [{ id: 'cabinet', label: t.navCabinet }] : []),
    { id: 'hero', label: lang === 'ua' ? 'Головна' : 'Home' },
    { id: 'services', label: t.navServices },
    { id: 'workflow', label: t.workflowBadge },
    { id: 'about', label: t.aboutBadge }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchAttempted(true);
    try {
      const results = await api.getOrdersByPhoneOrTracking(searchQuery.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStepState = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = statusWorkflow.findIndex(s => s.key === currentStatus);
    const stepIndex = statusWorkflow.findIndex(s => s.key === stepKey);
    if (currentStatus === 'CANCELED') return 'canceled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  const renderOrderTrackingCard = (order: Order) => (
    <div key={order.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{order.orderNumber}</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              {order.device.brand} {order.device.model}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => handleCopy(order.trackingCode)}
              className="text-xs text-slate-400 hover:text-blue-400 font-mono flex items-center gap-1 transition-colors"
            >
              <span>Код: {order.trackingCode}</span>
              {copiedCode === order.trackingCode ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-slate-500" />
              )}
            </button>
            <span className="text-xs text-slate-500">• Прийнято: {order.createdAt}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">До сплати</span>
          <span className="text-lg font-bold text-white font-mono">{order.totalCost} ₴</span>
        </div>
      </div>

      <div className="py-5">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {statusWorkflow.map((step) => {
            const state = getStepState(step.key, order.status);
            return (
              <div key={step.key} className="text-center">
                <div className={`h-1.5 rounded-full mb-2 ${
                  state === 'completed'
                    ? 'bg-emerald-500'
                    : state === 'current'
                    ? 'bg-blue-500 ring-2 ring-blue-500/30'
                    : 'bg-slate-800'
                }`} />
                <div className={`text-xs font-semibold ${
                  state === 'current' ? 'text-blue-400' : state === 'completed' ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#090D16] rounded-xl p-3.5 border border-slate-800/80">
          <div className="font-semibold text-slate-300 mb-1">Заявлена несправність:</div>
          <p className="text-slate-400 leading-relaxed">{order.defectDescription}</p>
          {order.diagnosticsNotes && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-amber-300/90 text-xs">
              <b>Висновок майстра:</b> {order.diagnosticsNotes}
            </div>
          )}
        </div>

        <div className="bg-[#090D16] rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="font-semibold text-slate-300 mb-2">Деталізація робіт та запчастин:</div>
            {order.parts.length === 0 && order.services.length === 0 ? (
              <p className="text-slate-500">Кошторис формується інженером після діагностики</p>
            ) : (
              <div className="space-y-1">
                {order.services.map((s, idx) => (
                  <div key={`s-${idx}`} className="flex justify-between text-slate-300">
                    <span className="truncate pr-2">🛠 {s.serviceName}</span>
                    <span className="font-mono text-slate-200 shrink-0">{s.price} ₴</span>
                  </div>
                ))}
                {order.parts.map((p, idx) => (
                  <div key={`p-${idx}`} className="flex justify-between text-slate-300">
                    <span className="truncate pr-2">
                      📦 {p.partName} ({p.quantity} шт.)
                    </span>
                    <span className="font-mono text-slate-200 shrink-0">
                      {p.unitPrice * p.quantity} ₴
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
            <span>Разом до сплати:</span>
            <span className="font-mono text-emerald-400">{order.totalCost} ₴</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Header with Top Utility Bar + Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#0B0F19] border-b border-slate-800/80 shadow-md">
        {/* Top Utility Information Bar */}
        <div className="bg-[#080B12] text-slate-400 text-xs border-b border-slate-800/60">
          <div className="w-full px-4 sm:px-8 lg:px-12 h-9 flex items-center justify-between">
            <div className="flex items-center gap-5 text-[12px] font-normal text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{t.city}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{t.workingHours}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-[12px]">
              {/* Telegram circular icon */}
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                title="Telegram"
                className="w-5 h-5 rounded-full bg-[#229ED9] hover:opacity-90 flex items-center justify-center text-white transition shadow-sm"
              >
                <Send className="h-2.5 w-2.5 ml-[-1px]" />
              </a>

              {/* Viber circular icon */}
              <a
                href="viber://chat"
                title="Viber"
                className="w-5 h-5 rounded-full bg-[#7360F2] hover:opacity-90 flex items-center justify-center text-white transition shadow-sm"
              >
                <Phone className="h-2.5 w-2.5" />
              </a>

              {/* Phone hotline */}
              <a
                href="tel:+380443345577"
                className="font-medium text-slate-200 hover:text-white transition tracking-tight"
              >
                +38 (044) 334-55-77
              </a>

              {/* Interactive Language dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer select-none text-[12px] pl-2 border-l border-slate-800 transition"
                  title={lang === 'ua' ? 'Змінити мову' : 'Switch language'}
                >
                  <span className="font-semibold">{lang.toUpperCase()}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLangDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl z-50 py-1 text-xs">
                      <button
                        type="button"
                        onClick={() => handleSelectLang('ua')}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition ${lang === 'ua' ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-300'}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">🇺🇦</span>
                          <span>Українська</span>
                        </span>
                        {lang === 'ua' && <span className="text-xs font-bold text-blue-400">✓</span>}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectLang('en')}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition ${lang === 'en' ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-300'}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">🇬🇧</span>
                          <span>English</span>
                        </span>
                        {lang === 'en' && <span className="text-xs font-bold text-blue-400">✓</span>}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-18 py-2 gap-4">
            {/* Brand Logo - Gear outline + FixPoint with glowing cyan focal dot on 'i' */}
            <div
              className="cursor-pointer select-none shrink-0 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Logo size="lg" />
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm text-slate-300 font-normal">
              <button
                onClick={() => scrollToSection('services')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.navServices}
              </button>
              <button
                onClick={() => {
                  scrollToSection('tracking');
                  const searchInput = document.querySelector('input[placeholder*="квитанц"], input[placeholder*="TRK"], input[placeholder*="трек"]') as HTMLInputElement | null;
                  if (searchInput) searchInput.focus();
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.navStatus}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.navCorporate}
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.navWarranty}
              </button>
              <button
                onClick={() => scrollToSection('contacts')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.navContacts}
              </button>
              {currentUser && (
                <button
                  onClick={() => scrollToSection('cabinet')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  {t.navCabinet}
                </button>
              )}
            </nav>

            {/* Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* "Перевірити статус" outlined pill button */}
              <button
                onClick={() => {
                  scrollToSection('tracking');
                  const searchInput = document.querySelector('input[placeholder*="квитанц"], input[placeholder*="TRK"], input[placeholder*="трек"]') as HTMLInputElement | null;
                  if (searchInput) searchInput.focus();
                }}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium text-slate-200 border border-slate-600 hover:border-slate-300 hover:text-white bg-transparent transition duration-200 cursor-pointer"
              >
                {t.btnCheckStatus}
              </button>

              {/* "Залишити заявку" solid blue pill button */}
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition duration-200 shadow-sm active:scale-95 cursor-pointer"
              >
                {t.btnSubmitOrder}
              </button>

              {/* User / Login controls */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-1">
                  <button
                    onClick={onOpenProfile}
                    className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    title={`${t.btnProfile}: ${currentUser.fullName}`}
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onLogout}
                    title={t.btnLogout}
                    className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {onOpenRegister && (
                    <button
                      onClick={onOpenRegister}
                      className="hidden sm:inline-block px-2.5 py-1 text-xs text-slate-400 hover:text-white transition"
                    >
                      {t.btnRegister}
                    </button>
                  )}
                  <button
                    onClick={onOpenLogin}
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title={t.btnLogin}
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Section Navigation Dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-2xl">
        {navSections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className="group relative flex items-center justify-center p-1.5 focus:outline-none"
            title={sec.label}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSection === sec.id
                  ? 'bg-cyan-400 scale-125 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-400/50'
                  : 'bg-slate-600 hover:bg-slate-400'
              }`}
            />
            <span className="absolute right-9 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-[11px] font-semibold text-cyan-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl">
              {sec.label}
            </span>
          </button>
        ))}
      </div>

      {currentUser && (
        <section id="cabinet" className="fullpage-section flex flex-col justify-center py-16 bg-gradient-to-b from-indigo-950/30 via-[#0F172A]/60 to-transparent border-b border-slate-800/80 relative">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 section-reveal ${visibleSections['cabinet'] ? 'active' : ''}`}>
            <div className="bg-[#111827] border border-indigo-500/25 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 pop-card delay-1">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.cabinetAuthorized}</span>
                  </span>
                  {currentUser.email && (
                    <span className="text-xs text-slate-400 font-mono">{currentUser.email}</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {t.cabinetWelcome} {currentUser.fullName}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  {t.cabinetDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={onOpenProfile}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>{t.cabinetSecBtn}</span>
                </button>
                <button
                  onClick={onOpenCreateModal}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.cabinetNewOrderBtn}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pop-card delay-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-400" />
                  <span>{t.cabinetMyOrders} ({myOrders.length})</span>
                </h3>
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-[#111827]/70 border border-slate-800 rounded-2xl p-8 text-center">
                  <Wrench className="h-8 w-8 text-slate-600 mx-auto mb-2.5" />
                  <h4 className="text-sm font-semibold text-slate-200">{t.cabinetNoOrdersTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {t.cabinetNoOrdersDesc}
                  </p>
                  <button
                    onClick={onOpenCreateModal}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.cabinetFirstOrderBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(renderOrderTrackingCard)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="hero" className={`fullpage-section flex flex-col justify-center py-14 relative ${searchAttempted ? 'overflow-y-auto min-h-screen h-auto py-20' : 'overflow-hidden'} border-b border-slate-800/60 bg-gradient-to-b from-[#0F172A]/40 to-transparent`}>
        {/* Animated ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow -z-0" />
        <div className="absolute top-1/3 left-1/4 w-[340px] h-[340px] bg-sky-400/15 rounded-full blur-[90px] pointer-events-none animate-pulse-glow-delayed -z-0" />

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 section-reveal ${visibleSections['hero'] ? 'active' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-medium mb-6 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/60 transition-all cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            {t.heroTitle1}
            <span className="animate-rainbow-text inline-block font-black">
              {t.heroTitle2}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div id="tracking" className="mt-8 max-w-2xl mx-auto bg-[#111827] p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-2xl shadow-cyan-950/25 focus-within:border-cyan-500/60 focus-within:shadow-cyan-500/20 transition-all duration-300">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="shimmer-btn px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-cyan-600/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                <span>{isSearching ? t.searchSearching : t.searchBtn}</span>
              </button>
            </form>
            <div className="flex items-center justify-between mt-2.5 px-2 text-[11px] text-slate-500">
              <span>{t.searchHint}</span>
              <button
                type="button"
                onClick={() => setSearchQuery('TRK-A8F91B')}
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono transition-colors"
              >
                {t.searchTry}
              </button>
            </div>
          </div>

          {searchAttempted && (
            <div id="search-results-box" className="mt-8 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{t.resultsTitle}</span>
                  {searchResults && (
                    <span className="text-xs font-normal text-cyan-400 font-mono">
                      ({t.resultsFound} {searchResults.length})
                    </span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={() => { setSearchAttempted(false); setSearchResults(null); setSearchQuery(''); }}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
                >
                  {t.resultsClear} ✕
                </button>
              </div>

              {searchResults && searchResults.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
                  <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-white">{t.notFoundTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {t.notFoundDesc}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults?.map(renderOrderTrackingCard)}
                </div>
              )}
            </div>
          )}

          {!searchAttempted && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-12 text-left">
              <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800 card-hover group cursor-default hover:border-cyan-500/50 pop-card delay-1">
                <Clock className="h-5 w-5 text-cyan-400 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <div className="text-sm font-bold text-white">{t.feature1Title}</div>
                <div className="text-xs text-slate-400">{t.feature1Desc}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800 card-hover group cursor-default hover:border-sky-500/50 pop-card delay-2">
                <ShieldCheck className="h-5 w-5 text-sky-400 mb-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                <div className="text-sm font-bold text-white">{t.feature2Title}</div>
                <div className="text-xs text-slate-400">{t.feature2Desc}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800 card-hover group cursor-default hover:border-blue-500/50 pop-card delay-3">
                <Wrench className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <div className="text-sm font-bold text-white">{t.feature3Title}</div>
                <div className="text-xs text-slate-400">{t.feature3Desc}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111827]/80 border border-slate-800 card-hover group cursor-default hover:border-indigo-500/50 pop-card delay-4">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 mb-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                <div className="text-sm font-bold text-white">{t.feature4Title}</div>
                <div className="text-xs text-slate-400">{t.feature4Desc}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="services" className="fullpage-section flex flex-col justify-center py-14 relative overflow-hidden border-b border-slate-800/80">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-reveal ${visibleSections['services'] ? 'active' : ''}`}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Wrench className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.servicesHeaderBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.servicesTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {t.servicesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between card-hover hover:border-cyan-500/50 group pop-card delay-1">
              <div>
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="h-5 w-5 animate-float" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{t.catLaptops}</h3>
                <ul className="text-xs text-slate-400 space-y-2 mb-6">
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Чистка + термопаста' : 'Cleaning + Thermal Paste'}</span>
                    <span className="font-semibold text-cyan-300 font-mono">{t.servicesPriceFrom} 600 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна матриці' : 'Display Replacement'}</span>
                    <span className="font-semibold text-cyan-300 font-mono">{t.servicesPriceFrom} 800 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Ремонт після залиття' : 'Liquid Damage Repair'}</span>
                    <span className="font-semibold text-cyan-300 font-mono">{t.servicesPriceFrom} 950 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна клавіатури' : 'Keyboard Replacement'}</span>
                    <span className="font-semibold text-cyan-300 font-mono">{t.servicesPriceFrom} 450 ₴</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenCreateModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-cyan-600 text-white transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {t.servicesBookBtn}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between card-hover hover:border-sky-500/50 group pop-card delay-2">
              <div>
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-5 w-5 animate-float-slow" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">{t.catSmartphones}</h3>
                <ul className="text-xs text-slate-400 space-y-2 mb-6">
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна дисплея' : 'Screen Replacement'}</span>
                    <span className="font-semibold text-sky-300 font-mono">{t.servicesPriceFrom} 750 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна акумулятора' : 'Battery Replacement'}</span>
                    <span className="font-semibold text-sky-300 font-mono">{t.servicesPriceFrom} 500 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? "Заміна роз'єму Type-C" : 'Type-C Port Repair'}</span>
                    <span className="font-semibold text-sky-300 font-mono">{t.servicesPriceFrom} 450 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Ремонт динаміка / мікрофона' : 'Speaker / Mic Repair'}</span>
                    <span className="font-semibold text-sky-300 font-mono">{t.servicesPriceFrom} 350 ₴</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenCreateModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-sky-600 text-white transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {t.servicesBookBtn}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between card-hover hover:border-blue-500/50 group pop-card delay-3">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Tablet className="h-5 w-5 animate-float" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{t.catTablets}</h3>
                <ul className="text-xs text-slate-400 space-y-2 mb-6">
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна сенсорного скла' : 'Touchscreen Glass'}</span>
                    <span className="font-semibold text-blue-300 font-mono">{t.servicesPriceFrom} 850 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна батареї iPad/Samsung' : 'iPad/Tablet Battery'}</span>
                    <span className="font-semibold text-blue-300 font-mono">{t.servicesPriceFrom} 900 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Прошивка / скидання' : 'Firmware & Reset'}</span>
                    <span className="font-semibold text-blue-300 font-mono">{t.servicesPriceFrom} 400 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Відновлення плати' : 'Logic Board Repair'}</span>
                    <span className="font-semibold text-blue-300 font-mono">{t.servicesPriceFrom} 1100 ₴</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenCreateModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-white transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {t.servicesBookBtn}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between card-hover hover:border-indigo-500/50 group pop-card delay-4">
              <div>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="h-5 w-5 animate-float-slow" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{t.catMonitors}</h3>
                <ul className="text-xs text-slate-400 space-y-2 mb-6">
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Діагностика материнської плати' : 'Motherboard Diagnostics'}</span>
                    <span className="font-semibold text-indigo-300 font-mono">{t.servicesPriceFrom} 400 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Ремонт блоку живлення' : 'Power Supply Repair'}</span>
                    <span className="font-semibold text-indigo-300 font-mono">{t.servicesPriceFrom} 650 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Складання / апгрейд ПК' : 'PC Assembly & Upgrade'}</span>
                    <span className="font-semibold text-indigo-300 font-mono">{t.servicesPriceFrom} 800 ₴</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{lang === 'ua' ? 'Заміна LED підсвітки' : 'LED Backlight Replacement'}</span>
                    <span className="font-semibold text-indigo-300 font-mono">{t.servicesPriceFrom} 700 ₴</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenCreateModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-indigo-600 text-white transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {t.servicesBookBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="fullpage-section flex flex-col justify-center py-14 relative overflow-hidden border-b border-slate-800/80 bg-[#0F172A]/25">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full section-reveal ${visibleSections['workflow'] ? 'active' : ''}`}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <ClipboardList className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.workflowBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.workflowTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              {t.workflowDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-cyan-500/50 pop-card delay-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-cyan-500/40 group-hover:text-cyan-400 transition-colors">01</span>
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><ClipboardList className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-sky-500/50 pop-card delay-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-sky-500/40 group-hover:text-sky-400 transition-colors">02</span>
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400"><Clock className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-blue-500/50 pop-card delay-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-blue-500/40 group-hover:text-blue-400 transition-colors">03</span>
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><CheckCircle2 className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-indigo-500/50 pop-card delay-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-indigo-500/40 group-hover:text-indigo-400 transition-colors">04</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><Wrench className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step4Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-sky-500/50 pop-card delay-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-sky-400/40 group-hover:text-sky-300 transition-colors">05</span>
                <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400"><ShieldCheck className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step5Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step5Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 card-hover group hover:border-cyan-500/50 pop-card delay-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black font-mono text-cyan-500/40 group-hover:text-cyan-400 transition-colors">06</span>
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400"><CheckCircle2 className="h-4 w-4" /></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.step6Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="fullpage-section flex flex-col justify-between pt-12 relative overflow-hidden bg-[#0F172A]/30 border-b border-slate-800">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6 section-reveal ${visibleSections['about'] ? 'active' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                {t.aboutBadge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {t.aboutTitle}
              </h2>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                {t.aboutP1}
              </p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                {t.aboutP2}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 card-hover pop-card delay-1">
                  <div className="text-2xl font-bold text-white font-mono">8+</div>
                  <div className="text-xs text-slate-400 mt-1">{t.aboutStatYears}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 card-hover pop-card delay-2">
                  <div className="text-2xl font-bold text-white font-mono">14 200+</div>
                  <div className="text-xs text-slate-400 mt-1">{t.aboutStatRepairs}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 card-hover pop-card delay-3">
                  <div className="text-2xl font-bold text-cyan-400 font-mono">98.6%</div>
                  <div className="text-xs text-slate-400 mt-1">{t.aboutStatSuccess}</div>
                </div>
              </div>
            </div>

            <div id="contacts" className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 pop-card delay-4">
              <h3 className="text-base font-bold text-white mb-4">{t.contactsTitle}</h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{t.contactAddressLabel}</span>
                    <span className="text-slate-400">{t.fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{t.contactHotlineLabel}</span>
                    <span className="text-slate-400 font-mono">+38 (044) 333-22-11 • +38 (067) 123-45-67</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">{t.contactHoursLabel}</span>
                    <span className="text-slate-400">{t.fullWorkingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{t.contactCtaText}</span>
                <button
                  onClick={onOpenCreateModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.contactCtaBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-800 bg-[#090D16] py-6 text-xs text-slate-500 w-full shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="text-slate-400 text-[11px]">Service Center</span>
              <span className="text-slate-700">•</span>
              <span>© 2026 {t.footerRights}</span>
            </div>

            <div className="flex items-center gap-4">
              {onOpenSupport && (
                <button onClick={onOpenSupport} className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <LifeBuoy className="h-3 w-3 text-cyan-400" />
                  <span>{t.footerSupport}</span>
                </button>
              )}
              {!currentUser && (
                <button onClick={onOpenLogin} className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer">
                  <Lock className="h-3 w-3 text-cyan-400" />
                  <span>{t.footerStaffLogin}</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};
