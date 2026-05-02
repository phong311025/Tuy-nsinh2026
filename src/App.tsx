/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Award,
  Youtube,
  Landmark,
  Facebook,
  Phone
} from 'lucide-react';
import { MAJORS, IELTS_CONVERSION, HSG_CONVERSION, Major, ADMISSION_METHODS } from './constants';

import { Chatbot } from './Chatbot';
import { hvtcLogoBase64 } from './logoBase64';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [method, setMethod] = useState<'PT2' | 'PT3'>('PT3');
  const [pt2Group, setPt2Group] = useState<'N1' | 'N2' | 'N3'>('N1');

  const [thpt, setThpt] = useState({ toan: 0, van: 0, anh: 0, ly: 0, hoa: 0, tin: 0 });
  const [hocba, setHocba] = useState({ toan: 0, maxOther: 0, max3: 0 });
  
  const [achievement, setAchievement] = useState('0'); // IELTS or HSG

  const [kv, setKv] = useState(0); 
  const [dt, setDt] = useState(0); 

  useEffect(() => {
    const logo = hvtcLogoBase64;
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = logo;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = logo;
      document.head.appendChild(newLink);
    }
  }, []);

  const handleThpt = (key: string, value: string) => setThpt(p => ({ ...p, [key]: parseFloat(value) || 0 }));
  const handleHocba = (key: string, value: string) => setHocba(p => ({ ...p, [key]: parseFloat(value) || 0 }));

  const getPriority = (rawScore: number) => {
    let p = kv + dt;
    if (rawScore >= 22.5) return ((30 - rawScore) / 7.50) * p;
    return p;
  };

  const getAchievementScore = () => {
    if (achievement === '0') return 0;
    if (IELTS_CONVERSION[achievement]) return IELTS_CONVERSION[achievement];
    if (HSG_CONVERSION[achievement]) return HSG_CONVERSION[achievement];
    return 0;
  };

  const calculatePT3 = () => {
    const combos = [
      thpt.toan + thpt.ly + thpt.hoa,
      thpt.toan + thpt.ly + thpt.anh,
      thpt.toan + thpt.van + thpt.anh,
      thpt.toan + thpt.hoa + thpt.anh,
      thpt.toan + thpt.ly + thpt.tin,
      thpt.toan + thpt.tin + thpt.anh
    ];

    const rawScore = Math.max(...combos);
    return rawScore;
  };

  const calculatePT2 = () => {
    let rawScore = 0;
    const achieveScore = getAchievementScore();

    if (pt2Group === 'N1') {
      if (['0', '5.5', '6.0', '6.5', 'Ba Tỉnh', 'Nhì Tỉnh'].includes(achievement)) {
        return 0; // Not allowed to use PT2 N1 without IELTS >= 7.0 or Nhất Tỉnh/KKQG
      }
      rawScore = hocba.toan + hocba.maxOther + achieveScore;
    } else if (pt2Group === 'N2') {
      rawScore = thpt.toan + hocba.max3 + achieveScore;
    } else if (pt2Group === 'N3') {
      const thiMaxOther = Math.max(thpt.van, thpt.ly, thpt.hoa, thpt.anh, thpt.tin);
      rawScore = thpt.toan + hocba.max3 + thiMaxOther;
    }
    return rawScore;
  };

  const results = useMemo(() => {
    let bestRaw = 0;
    if (method === 'PT2') bestRaw = calculatePT2();
    if (method === 'PT3') bestRaw = calculatePT3();

    const userScore = bestRaw > 0 ? bestRaw + getPriority(bestRaw) : 0;
    
    return MAJORS.map(major => {
      const diff = userScore - major.benchmark2025;
      const isPass = userScore >= major.benchmark2025 && userScore > 0;

      return {
        ...major,
        userScore: parseFloat(userScore.toFixed(2)),
        diff: parseFloat(diff.toFixed(2)),
        isPass
      };
    });
  }, [method, pt2Group, thpt, hocba, achievement, kv, dt]);

  const bestScoreOverall = Math.max(...results.map(r => r.userScore), 0);
  const passCount = results.filter(r => r.isPass).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden" id="app_container">
      {/* Header Bar */}
      <header className="bg-aof-teal text-white px-4 md:px-8 py-3 flex flex-col sm:flex-row justify-between items-center border-b-4 border-aof-gold shadow-md shrink-0 gap-4" id="header">
        <a href="https://xettuyen.hvtc.edu.vn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-center sm:text-left hover:opacity-90 transition-opacity" id="header_left">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0 overflow-hidden text-aof-teal" id="logo">
            <img src={hvtcLogoBase64} alt="HVTC Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none" id="header_title">HỌC VIỆN TÀI CHÍNH</h1>
            <p className="text-[10px] md:text-xs text-teal-100 uppercase tracking-widest font-semibold mt-1" id="header_subtitle">Công cụ Tra cứu & Tính điểm Xét tuyển 2026</p>
          </div>
        </a>
        <div className="hidden sm:block text-right" id="header_right">
          <div className="text-[10px] opacity-70 uppercase font-bold tracking-tighter">Cổng thông tin tuyển sinh</div>
          <a href="https://xettuyen.hvtc.edu.vn" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-sm tracking-widest text-aof-gold hover:underline">XETTUYEN.HVTC.EDU.VN</a>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 xl:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full" id="main_content">
        
        {/* Sidebar: Inputs */}
        <aside className="md:col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6" id="sidebar">
          
          <div className="bg-gradient-to-br from-teal-500 to-aof-teal rounded-xl p-6 text-center shadow-md relative overflow-hidden" id="best_score_summary">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-teal-900 opacity-20 rounded-full blur-xl pointer-events-none"></div>
             <div className="relative z-10">
               <span className="text-[11px] uppercase font-bold text-teal-100 tracking-[0.15em] block mb-1">Mức điểm cao nhất</span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-5xl font-black text-white drop-shadow-sm" id="total_val">
                    {bestScoreOverall.toFixed(2)}
                  </span>
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="recommendation_box">
            <h2 className="text-sm font-black text-aof-gold uppercase mb-3 flex items-center gap-2 border-l-4 border-aof-gold pl-3">
              <CheckCircle2 className="w-4 h-4" /> Có khả năng trúng tuyển
            </h2>
            {bestScoreOverall === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Hãy nhập điểm để xem gợi ý ngành.
              </div>
            ) : passCount === 0 ? (
              <div className="text-xs text-red-500 text-center py-4 bg-red-50 rounded-lg border border-dashed border-red-200">
                Chưa đủ điểm chuẩn 2025 cho ngành nào.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {results.filter(r => r.isPass).sort((a,b) => b.diff - a.diff).map(major => (
                  <div key={`suggest_${major.id}`} className="bg-green-50 border border-green-100 p-2.5 rounded-lg flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-2">{major.name}</span>
                    <span className="text-[10px] font-black text-green-700 bg-green-200 px-2 py-1 rounded whitespace-nowrap">
                      +{major.diff.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="method_section">
            <h2 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2 border-l-4 border-slate-800 pl-3">
              <Calculator className="w-4 h-4" /> Phương Thức Xét Tuyển
            </h2>
            <div className="space-y-4">
              <div className="space-y-1 block">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2" htmlFor="method_select">Chọn Phương Thức</label>
                <select 
                  id="method_select"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-aof-teal cursor-pointer"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as 'PT2' | 'PT3')}
                >
                  {ADMISSION_METHODS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {method === 'PT2' && (
                <div className="space-y-1 block mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2" htmlFor="pt2_group_select">Nhóm Đối Tượng (PT2)</label>
                  <select 
                    id="pt2_group_select"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-aof-teal cursor-pointer" 
                    value={pt2Group} 
                    onChange={(e) => setPt2Group(e.target.value as 'N1'|'N2'|'N3')}
                  >
                    <option value="N1">Nhóm 1: Học bạ (Toán + Max(V,L,H,T)) + CCQT/Giải</option>
                    <option value="N2">Nhóm 2: Thi Toán + Học bạ 3 môn + CCQT/Giải</option>
                    <option value="N3">Nhóm 3: Thi Toán + Học bạ 3 môn + Thi môn khác</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-black text-aof-teal uppercase mb-4 flex items-center gap-2 border-l-4 border-aof-teal pl-3">
              <Award className="w-4 h-4" /> Điểm Ưu tiên (2026)
            </h2>
            <div className="grid grid-cols-2 gap-3" id="priority_grid">
              <div className="space-y-1 block" id="priority_kv_group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block" htmlFor="priority_kv">Khu Vực</label>
                <select 
                  id="priority_kv"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-aof-teal"
                  value={kv}
                  onChange={(e) => setKv(parseFloat(e.target.value))}
                >
                  <option value="0">KV3 (0.00)</option>
                  <option value="0.25">KV2 (0.25)</option>
                  <option value="0.5">KV2-NT (0.50)</option>
                  <option value="0.75">KV1 (0.75)</option>
                </select>
              </div>

              <div className="space-y-1 block" id="priority_dt_group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block" htmlFor="priority_dt">Đối Tượng</label>
                <select 
                  id="priority_dt"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-aof-teal"
                  value={dt}
                  onChange={(e) => setDt(parseFloat(e.target.value))}
                >
                  <option value="0">Không có (0.00)</option>
                  <option value="1.0">Nhóm 2: ĐT 04-06 (1.00)</option>
                  <option value="2.0">Nhóm 1: ĐT 01-03 (2.00)</option>
                </select>
              </div>
            </div>
            {(kv + dt) > 0 && (
              <p className="text-[10px] text-slate-500 font-medium mt-3 italic">* Nếu Tống điểm 3 môn ≥ 22.5, điểm ưu tiên bằng: [(Mức ưu tiên) × (30 - Tổng điểm đạt) / 7.5].</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="inputs_section">
            <h2 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2 border-l-4 border-slate-800 pl-3">
              <Calculator className="w-4 h-4" /> Nhập Điểm Thành Phần
            </h2>

            {/* IELTS or HSG Input */}
            {(method === 'PT2' && (pt2Group === 'N1' || pt2Group === 'N2')) && (
              <div className="mb-6 p-4 bg-orange-50/50 border border-orange-100 rounded-lg animate-in fade-in duration-300">
                <label className="block text-[11px] font-bold text-orange-800 uppercase tracking-widest flex items-center justify-between mb-3">
                  <span>Giải HSG / IELTS</span>
                  <span className="text-[9px] bg-orange-100 px-2 py-0.5 rounded text-orange-600">Thành Tích</span>
                </label>
                <select 
                  className="w-full border border-orange-200 rounded-md px-3 py-2 text-sm font-bold text-orange-900 bg-white shadow-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 cursor-pointer"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                >
                  <option value="0">Không có (0)</option>
                  <optgroup label="IELTS (Hoặc chứng chỉ T.A tương đương)">
                    <option value="5.5" disabled={method === 'PT2' && pt2Group === 'N1'}>IELTS 5.5 / TOEFL iBT 46-59 / SAT 1050 / ACT 20 (9.0 Điểm)</option>
                    <option value="6.0" disabled={method === 'PT2' && pt2Group === 'N1'}>IELTS 6.0 / TOEFL iBT 60-78 / SAT 1100 / ACT 22 (9.25 Điểm)</option>
                    <option value="6.5" disabled={method === 'PT2' && pt2Group === 'N1'}>IELTS 6.5 / TOEFL iBT 79-93 / SAT 1150 / ACT 24 (9.5 Điểm)</option>
                    <option value="7.0">IELTS 7.0 / TOEFL iBT 94-101 / SAT 1200 / ACT 26 (9.75 Điểm)</option>
                    <option value="7.5+">IELTS 7.5+ / TOEFL iBT 102+ / SAT 1300+ / ACT 28+ (10.0 Điểm)</option>
                  </optgroup>
                  <optgroup label="Giải HSG">
                    <option value="Ba Tỉnh" disabled={method === 'PT2' && pt2Group === 'N1'}>Giải Ba Tỉnh/TP (9.0)</option>
                    <option value="Nhì Tỉnh" disabled={method === 'PT2' && pt2Group === 'N1'}>Giải Nhì Tỉnh/TP (9.5)</option>
                    <option value="Nhất Tỉnh/Khuyến Khích QG">Giải Nhất Tỉnh / KK Quốc Gia (10.0)</option>
                  </optgroup>
                </select>
                {method === 'PT2' && pt2Group === 'N1' && (
                  <p className="text-[9px] text-orange-600 mt-2 font-medium">* Nhóm 1 yêu cầu IELTS 7.0+ hoặc Giải Nhất Tỉnh/KK Quốc Gia.</p>
                )}
              </div>
            )}

            {/* Học Bạ Section */}
            {method === 'PT2' && (
              <div className="mb-6 animate-in fade-in duration-300">
                 <h3 className="text-xs font-black text-slate-700 uppercase mb-3 border-b border-slate-100 pb-2">Điểm Học Bạ (TBC 3 năm THPT)</h3>
                 <div className="grid grid-cols-2 gap-3 pb-2">
                    {pt2Group === 'N1' && (
                      <>
                        <ScoreInput label="TBC Toán" value={hocba.toan} onChange={(v) => handleHocba('toan', v)} id="h_toan" />
                        <ScoreInput label="Max(Văn,Lý,Hóa,Tin)" value={hocba.maxOther} onChange={(v) => handleHocba('maxOther', v)} id="h_maxOth" />
                      </>
                    )}
                    {(pt2Group === 'N2' || pt2Group === 'N3') && (
                      <div className="col-span-2">
                        <ScoreInput label="TBC Tổ hợp 3 môn cao nhất" value={hocba.max3} onChange={(v) => handleHocba('max3', v)} id="h_max3" />
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Thi THPT Section */}
            {(method === 'PT3' || (method === 'PT2' && (pt2Group === 'N2' || pt2Group === 'N3'))) && (
               <div className="animate-in fade-in duration-300">
                  <h3 className="text-xs font-black text-slate-700 uppercase mb-3 border-b border-slate-100 pb-2">Điểm Thi THPT 2026</h3>
                  
                  {method === 'PT3' ? (
                     <div className="grid grid-cols-2 gap-3">
                        <ScoreInput label="Toán" value={thpt.toan} onChange={(v) => handleThpt('toan', v)} id="t_toan" />
                        <ScoreInput label="Ngữ Văn" value={thpt.van} onChange={(v) => handleThpt('van', v)} id="t_van" />
                        <ScoreInput label="Tiếng Anh" value={thpt.anh} onChange={(v) => handleThpt('anh', v)} id="t_anh" />
                        <ScoreInput label="Vật Lý" value={thpt.ly} onChange={(v) => handleThpt('ly', v)} id="t_ly" />
                        <ScoreInput label="Hóa Học" value={thpt.hoa} onChange={(v) => handleThpt('hoa', v)} id="t_hoa" />
                        <ScoreInput label="Tin Học" value={thpt.tin} onChange={(v) => handleThpt('tin', v)} id="t_tin" />
                     </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <ScoreInput label="Môn Toán" value={thpt.toan} onChange={(v) => handleThpt('toan', v)} id="t_toan" />
                        {pt2Group === 'N3' && (
                          <div className="col-span-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Thi Môn khác cao nhất</label>
                            <div className="text-[9px] text-slate-400 mb-2 font-medium italic">Nhập điểm cao nhất của bạn trong các môn: Văn, Lý, Hóa, Anh, Tin </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              <ScoreInput label="Văn" value={thpt.van} onChange={(v) => handleThpt('van', v)} id="t_van" />
                              <ScoreInput label="Anh" value={thpt.anh} onChange={(v) => handleThpt('anh', v)} id="t_anh" />
                              <ScoreInput label="Lý" value={thpt.ly} onChange={(v) => handleThpt('ly', v)} id="t_ly" />
                              <ScoreInput label="Hóa" value={thpt.hoa} onChange={(v) => handleThpt('hoa', v)} id="t_hoa" />
                              <ScoreInput label="Tin" value={thpt.tin} onChange={(v) => handleThpt('tin', v)} id="t_tin" />
                            </div>
                          </div>
                        )}
                    </div>
                  )}
               </div>
            )}
            
          </div>
        </aside>

        {/* Content: Results Table */}
        <section className={`md:col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col h-full overflow-hidden min-h-[500px] transition-all duration-300 ${isChatOpen ? 'lg:pr-[410px]' : ''}`} id="results_main">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden" id="table_card">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50" id="table_header">
              <h2 className="text-sm font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                Gợi ý Ngành & Khả năng trúng tuyển
              </h2>
              <div className="flex gap-2" id="table_badges">
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">{passCount} NGÀNH ĐỖ</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-50/50" id="table_scroll_area" style={{ maxHeight: "calc(100vh - 200px)" }}>
              {/* Desktop Table View */}
              <table className="w-full border-collapse hidden md:table" id="results_table_desktop">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-100/90 backdrop-blur-md text-[10px] text-slate-500 uppercase font-black text-left shadow-sm">
                    <th className="p-3 lg:p-4 border-b border-slate-200 whitespace-nowrap">Ngành / Chương trình (Mã XT)</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-center whitespace-nowrap">Video</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-center whitespace-nowrap">CT 2025</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-center whitespace-nowrap bg-blue-50/50">CT 2026</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-center whitespace-nowrap">Điểm 2025</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-center whitespace-nowrap">Tổng ĐXT</th>
                    <th className="p-3 lg:p-4 border-b border-slate-200 text-right whitespace-nowrap">Đánh Giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {results.map((major) => (
                    <tr key={major.id} className={`transition-colors ${major.isPass ? 'bg-white hover:bg-slate-50' : major.userScore > 0 ? 'bg-slate-50/50 opacity-80' : 'bg-white'}`} id={`row_${major.id}`}>
                      <td className="p-3 lg:p-4">
                        <div className="font-bold text-slate-800 text-sm mb-1">{major.name}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black text-slate-400 uppercase">{major.code}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                            major.group === 'CCQT' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>{major.group === 'CCQT' ? 'Định hướng CCQT' : 'Chuẩn (Đại trà)'}</span>
                        </div>
                      </td>
                      <td className="p-3 lg:p-4 text-center align-middle">
                        {major.links && major.links.length > 0 && (
                          <div className="flex flex-col gap-1.5 items-center justify-center">
                            {major.links.map((link, i) => (
                              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white text-red-600 px-2 py-1.5 rounded-md border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all whitespace-nowrap" title={link.name}>
                                <Youtube className="w-3.5 h-3.5" />
                                <span>{link.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 lg:p-4 text-center">
                        <div className="font-mono text-xs font-medium text-slate-500">{major.quota2025 || '-'}</div>
                      </td>
                      <td className="p-3 lg:p-4 text-center bg-blue-50/20">
                        <div className="font-mono text-xs font-bold text-blue-800">{major.quota2026}</div>
                      </td>
                      <td className="p-3 lg:p-4 text-center">
                        <div className="font-black text-slate-800">{major.benchmark2025 > 0 ? major.benchmark2025.toFixed(2) : '-'}</div>
                      </td>
                      <td className={`p-3 lg:p-4 text-center font-black text-lg ${major.diff >= 0 ? 'text-green-600' : 'text-slate-600'}`}>
                        {major.userScore > 0 ? major.userScore.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 lg:p-4 text-right">
                        {major.userScore === 0 ? (
                            <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-1.5 rounded-md font-black uppercase tracking-tighter whitespace-nowrap block w-full text-center">Chờ nhập</span>
                        ) : major.isPass ? (
                          <span className={`${major.diff > 1.5 ? 'bg-green-600' : 'bg-green-500'} text-white text-[9px] px-2.5 py-1.5 rounded-md font-black uppercase tracking-tighter shadow-sm inline-flex items-center justify-center w-full gap-1 whitespace-nowrap`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {major.diff > 1.5 ? 'AN TOÀN' : 'CÓ KHẢ NĂNG'}
                          </span>
                        ) : (
                          <span className="bg-slate-400 text-white text-[9px] px-2.5 py-1.5 rounded-md font-black uppercase tracking-tighter shadow-sm inline-flex items-center justify-center w-full gap-1 whitespace-nowrap">
                            <XCircle className="w-3 h-3" />
                            KHÔNG ĐỦ
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col p-3 gap-3" id="results_cards_mobile">
                {results.map((major) => (
                  <div key={`mob_${major.id}`} className={`border rounded-xl p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden ${major.isPass ? 'bg-white border-green-200' : major.userScore > 0 ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-slate-200'}`}>
                    
                    {/* Status Badge Positioned absolute to save space */}
                    <div className="absolute top-3 right-3">
                      {major.userScore === 0 ? (
                            <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter shadow-sm inline-flex">Chờ nhập</span>
                      ) : major.isPass ? (
                          <span className={`${major.diff > 1.5 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-green-50 text-green-600 border border-green-200'} text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tight shadow-sm inline-flex items-center gap-1`}>
                            <CheckCircle2 className="w-3 h-3" /> {major.diff > 1.5 ? 'An toàn' : 'Có khả năng'}
                          </span>
                      ) : (
                          <span className="bg-white text-slate-500 text-[9px] px-2 py-1 rounded-full border border-slate-200 font-black uppercase tracking-tight shadow-sm inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Không đủ
                          </span>
                      )}
                    </div>

                    <div className="pr-20">
                      <div className="font-black text-slate-800 text-[13px] leading-tight mb-1">{major.name}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-black text-slate-400 uppercase">{major.code}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          major.group === 'CCQT' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>{major.group === 'CCQT' ? 'Định hướng CCQT' : 'Chuẩn (Đại trà)'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 mt-1">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Điểm xét vào</div>
                        <div className={`font-black text-base ${major.diff >= 0 ? 'text-green-600' : 'text-slate-800'}`}>
                          {major.userScore > 0 ? major.userScore.toFixed(2) : '-'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-semibold mb-0.5">Chuẩn 2025</div>
                        <div className="font-bold text-slate-700 text-base">
                          {major.benchmark2025 > 0 ? major.benchmark2025.toFixed(2) : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-3">
                         <div>
                           <div className="text-[9px] text-slate-400 uppercase font-black">CT 2025</div>
                           <div className="text-xs font-mono font-medium text-slate-600">{major.quota2025 || '-'}</div>
                         </div>
                         <div>
                           <div className="text-[9px] text-blue-500 uppercase font-black">CT 2026</div>
                           <div className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-1.5 rounded">{major.quota2026}</div>
                         </div>
                      </div>

                      {major.links && major.links.length > 0 && (
                          <div className="flex gap-1.5 items-center">
                            {major.links.map((link, i) => (
                              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm" title={link.name}>
                                <Youtube className="w-3.5 h-3.5" /> Video
                              </a>
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-orange-50 border-t border-orange-100 text-[10px] text-orange-800 font-medium leading-relaxed" id="table_footer_info">
              <strong className="uppercase">Hệ thống thông minh:</strong> 
              <span> Tự động lựa chọn tổ hợp môn thi cao điểm nhất để xét cho từng ngành. Tự động so sánh điểm Thi THPT và điểm kết hợp Xét chứng chỉ IELTS để đưa ra Điểm Xét Tuyển lớn nhất có thể của bạn. Thang điểm IELTS theo hướng dẫn tuyển sinh mới năm 2026.</span>
            </div>
            
            <a href="https://xettuyen.hvtc.edu.vn" target="_blank" rel="noopener noreferrer" className="p-4 bg-[#0e746b] border-t border-[#0b5c55] text-sm text-white font-bold leading-relaxed text-center hover:bg-[#0b5c55] transition-colors block uppercase tracking-wide" id="register_banner">
              Đăng ký xét tuyển ngay
            </a>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-4 md:left-6 flex flex-col gap-3 z-40">
        <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" className="w-[52px] h-[52px] bg-[#1a65f2] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all group" title="Group Tư vấn Tuyển sinh">
          <Facebook className="w-7 h-7 group-hover:drop-shadow-md" />
        </a>
        <a href="tel:0961481086" className="w-[52px] h-[52px] bg-[#0bc14f] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-1 transition-all group" title="Hotline 0961.481.086">
          <Phone className="w-7 h-7 group-hover:drop-shadow-md" />
        </a>
      </div>

      {/* Help Section */}
      <div className="w-full bg-slate-50 py-10 border-t border-slate-200 mt-auto shrink-0 flex flex-col items-center justify-center text-center px-4 relative z-10" id="help_section">
        <p className="text-slate-600 text-[15px] font-medium mb-5">Cần trợ giúp thêm? Liên hệ ngay với chúng tôi:</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-6 py-3 bg-blue-50/80 text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm text-sm">
            <Facebook className="w-5 h-5" />
            Group Tư vấn tuyển sinh Học viện Tài chính
          </a>
          <a href="tel:0961481086" className="flex items-center gap-2.5 px-6 py-3 bg-green-50/80 text-green-600 rounded-full font-semibold hover:bg-green-100 transition-colors border border-green-200 shadow-sm text-sm">
            <Phone className="w-5 h-5" />
            Hotline: 0961.481.086 - 0967.684.086
          </a>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="h-10 bg-slate-800 text-slate-400 px-4 md:px-8 flex justify-between items-center text-[10px] font-bold shrink-0 shadow-inner relative z-10" id="app_footer">
        <span className="uppercase tracking-widest opacity-80 truncate">© 2026 Học Viện Tài Chính - AOF</span>
        <div className="flex gap-4 md:gap-6 uppercase tracking-tighter shrink-0" id="footer_contact">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Hotline: 0961.48.10.10</span>
        </div>
      </footer>
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}

function ScoreInput({ label, value, onChange, id }: { label: string, value: number, onChange: (v: string) => void, id: string }) {
  return (
    <div className="space-y-1 block" id={`input_group_${id}`}>
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        step="0.01"
        min="0"
        max="10"
        value={value || ''}
        placeholder="0.0"
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:border-aof-teal focus:ring-1 focus:ring-aof-teal bg-white transition-all font-mono font-bold text-sm text-slate-800 shadow-sm"
      />
    </div>
  );
}
