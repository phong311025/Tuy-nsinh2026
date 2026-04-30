/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Major {
  id: string;
  code: string;
  name: string;
  benchmark2025: number;
  quota2025: number;
  quota2026: number;
  isLanguageOrCCQT: boolean;
  group: 'CH' | 'CCQT' | 'DDP'; // Chuẩn, Chứng chỉ quốc tế, Dual Degree
  links?: { name: string, url: string }[];
}

// Dựa theo Chỉ tiêu dự kiến 2026 và Điểm chuẩn 2025 
export const MAJORS: Major[] = [
  // CHƯƠNG TRÌNH ĐỊNH HƯỚNG CHỨNG CHỈ QUỐC TẾ (CCQT)
  { id: '1', code: '7310104 - HC12.01QT', name: 'Kinh tế đầu tư (ACCA)', benchmark2025: 22.82, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kinh tế đầu tư (ACCA)', url: 'https://youtu.be/d3i5ubERAnA?si=jeiz41ZX6C_Y5RGE'}] },
  { id: '2', code: '7340101 - HC03.01QT', name: 'Quản trị doanh nghiệp (ICAEW)', benchmark2025: 22.58, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Quản trị doanh nghiệp (ICAEW)', url: 'https://youtu.be/5b6rMYnwEXE?si=CYNbUER4_cCOCqyW'}] },
  { id: '3', code: '7340115 - HC11.02QT', name: 'Digital Marketing (ICDL)', benchmark2025: 23.44, quota2025: 200, quota2026: 200, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Digital Marketing (ICDL)', url: 'https://youtu.be/HthvBIXS9_c?si=_LPh3MwH3c-Ab_IY'}] },
  { id: '4', code: '7340116 - HC09.01QT', name: 'Thẩm định giá (ACCA)', benchmark2025: 21.00, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Thẩm định giá & Kinh doanh BĐS (ACCA)', url: 'https://youtu.be/LcLhFwGMnsI?si=VbEYHAbmZ0_4KRgt'}] },
  { id: '5', code: '7340120 - HC15.01QT', name: 'Kinh doanh quốc tế (ICAEW)', benchmark2025: 24.89, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kinh doanh quốc tế (ICAEW)', url: 'https://youtu.be/qZ6PFTK_lWM?si=puUIGFg2DDf588k5'}] },
  { id: '6', code: '7340201 - HC01.01QT', name: 'Thuế và Quản trị thuế (ACCA)', benchmark2025: 21.00, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Thuế và quản trị thuế (ACCA)', url: 'https://youtu.be/wloGtWTYRp8?si=8oKr0B99568LxABM'}] },
  { id: '7', code: '7340201 - HC01.06QT', name: 'Hải quan & Logistics (FIATA)', benchmark2025: 21.30, quota2025: 600, quota2026: 370, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Hải quan và Logistics (FIATA)', url: 'https://youtu.be/taPyi3Ga7ek?si=yPcP7GJLy3nEtTs3'}] },
  { id: '8', code: '7340201 - HC01.09QT', name: 'Phân tích tài chính (ICAEW)', benchmark2025: 21.00, quota2025: 350, quota2026: 240, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Phân tích tài chính (ICAEW)', url: 'https://youtu.be/u65yngMz9Fw?si=9rOqk9EDVCq3hTKE'}] },
  { id: '9', code: '7340201 - HC01.11QT', name: 'Tài chính doanh nghiệp (ACCA)', benchmark2025: 21.00, quota2025: 700, quota2026: 370, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Tài chính doanh nghiệp (ACCA)', url: 'https://youtu.be/m23tl0aIb2I?si=xG0E7uhD7AZUDXks'}] },
  { id: '10', code: '7340201 - HC01.15QT', name: 'Ngân hàng (ICAEW)', benchmark2025: 21.00, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Ngân hàng (ICAEW)', url: 'https://youtu.be/felxbrQna-o?si=_FG9I6mq9Dk9DDfL'}] },
  { id: '11', code: '7340201 - HC01.19QT', name: 'Đầu tư tài chính (ICAEW)', benchmark2025: 21.00, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Đầu tư Tài chính (ICAEW)', url: 'https://youtu.be/KTbS1DsyiLM?si=tJ0NY1rAekpq7X8p'}] },
  { id: '12', code: '7340301 - HC02.01QT', name: 'Kế toán doanh nghiệp (ACCA)', benchmark2025: 21.50, quota2025: 500, quota2026: 350, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kế toán doanh nghiệp (ACCA)', url: 'https://youtu.be/CCSpRsUkmlQ?si=_H_2l5y6lPsLALIn'}] },
  { id: '13', code: '7340301 - HC02.02QT', name: 'KKT quản trị & Kiểm soát (CMA)', benchmark2025: 21.00, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kế toán quản trị & Kiểm soát (CMA)', url: 'https://youtu.be/YVbTvG0iY4U?si=yin0Uyv3i4A-VC3P'}] },
  { id: '14', code: '7340301 - HC02.03QT', name: 'Kế toán công (ACCA)', benchmark2025: 21.50, quota2025: 50, quota2026: 80, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kế toán công (ACCA)', url: 'https://youtu.be/bD2oUvxM9M4?si=eKnZcgy6Phzv_Dkt'}] },
  { id: '15', code: '7340302 - HC10.01QT', name: 'Kiểm toán (ICAEW)', benchmark2025: 21.50, quota2025: 500, quota2026: 370, isLanguageOrCCQT: true, group: 'CCQT', links: [{name: 'Kiểm toán (ICAEW)', url: 'https://youtu.be/RTJ9Jmudtb4?si=4QWjD0asLrc9e3hU'}] },

  // CHƯƠNG TRÌNH CHUẨN (ĐẠI TRÀ)
  { id: '16', code: '7220201 - HC05.01', name: 'Tiếng Anh tài chính kế toán', benchmark2025: 24.10, quota2025: 160, quota2026: 160, isLanguageOrCCQT: true, group: 'CH', links: [{name: 'Tiếng Anh TCKT', url: 'https://youtu.be/1ZAutXUbO7w?si=JDHd1XHtbPe0FqdG'}] },
  { id: '17', code: '7310101 - HC06.01', name: 'Kinh tế & QL nguồn lực tài chính', benchmark2025: 25.43, quota2025: 80, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Kinh tế & QL nguồn lực', url: 'https://youtu.be/GxbmpJvkihY?si=9NumTVdcNhPCDFV0'}] },
  { id: '18', code: '7310102 - HC16.01', name: 'Kinh tế chính trị - Tài chính', benchmark2025: 24.92, quota2025: 50, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Kinh tế chính trị - Tài chính', url: 'https://youtu.be/dF33Oskq3qs?si=3eOcvhSEV0MhY5UW'}] },
  { id: '19', code: '7310104 - HC12.01', name: 'Kinh tế đầu tư', benchmark2025: 25.56, quota2025: 150, quota2026: 150, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Kinh tế đầu tư', url: 'https://youtu.be/flgaKL-Xuu8?si=_2-psQWjNkOHWmIC'}] },
  { id: '20', code: '7310108 - HC18.01', name: 'Toán tài chính', benchmark2025: 24.57, quota2025: 50, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Toán tài chính', url: 'https://youtu.be/nzb3YeySyX8?si=CKtB9j7L0BfeeImM'}] },
  { id: '21', code: '7340101 - HC03.12', name: 'QTDN; Quản trị KD du lịch', benchmark2025: 24.98, quota2025: 160, quota2026: 160, isLanguageOrCCQT: false, group: 'CH', links: [
    {name: 'Quản trị doanh nghiệp', url: 'https://youtu.be/OP-_TtzPPag?si=rvsEL5qgkXmvSOuf'},
    {name: 'Quản trị KD du lịch', url: 'https://youtu.be/C6FZ0HwsVpE?si=WqOD1oXXJgU5XPZ0'}
  ] },
  { id: '22', code: '7340115 - HC11.01', name: 'Marketing', benchmark2025: 26.23, quota2025: 80, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Marketing', url: 'https://youtu.be/SEntLuwNm9M?si=1b6yPd1_a3zPhxiD'}] },
  { id: '23', code: '7340116 - HC09.01', name: 'Thẩm định giá & Kinh doanh BĐS', benchmark2025: 21.51, quota2025: 80, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Thẩm định giá & Kinh doanh BĐS', url: 'https://youtu.be/DzHlsazthnA?si=rgnflMwo8mtfu99e'}] },
  { id: '24', code: '73402011 - HC01.01', name: 'Tài chính Ngân hàng 1 (Thuế; Hải quan & NVNT; Tài chính quốc tế)', benchmark2025: 25.47, quota2025: 350, quota2026: 350, isLanguageOrCCQT: false, group: 'CH', links: [
    {name: 'Thuế', url: 'https://youtu.be/pDx3y6ensJE?si=MOboG7wwErLegqgq'},
    {name: 'Hải quan & NV Ngoại thương', url: 'https://youtu.be/qlCBC06Cn7c?si=qLzr2si3fqjzvy_o'},
    {name: 'Tài chính quốc tế', url: 'https://youtu.be/csUZbLLQTPo?si=-Mhk4QpgNeYlxJCX'}
  ] },
  { id: '25', code: '73402012 - HC01.02', name: 'Tài chính Ngân hàng 2 (Tài chính doanh nghiệp; Phân tích tài chính)', benchmark2025: 26.31, quota2025: 300, quota2026: 300, isLanguageOrCCQT: false, group: 'CH', links: [
    {name: 'Tài chính doanh nghiệp', url: 'https://youtu.be/bjmXDwjRqEc?si=10d48JTEW7tXV_Yl'},
    {name: 'Phân tích tài chính', url: 'https://youtu.be/c7tv2AMk1Fs?si=ifxi-knE4UBkNAnh'}
  ] },
  { id: '26', code: '73402013 - HC01.03', name: 'Tài chính Ngân hàng 3 (Ngân hàng; Đầu tư tài chính)', benchmark2025: 25.40, quota2025: 180, quota2026: 180, isLanguageOrCCQT: false, group: 'CH', links: [
    {name: 'Ngân hàng', url: 'https://youtu.be/jRYn27Z6RVs?si=u-xtHwLRCZlntp82'},
    {name: 'Đầu tư Tài chính', url: 'https://youtu.be/whX6Tp3wMDw?si=81LsUTIN4yCM8QM8'}
  ] },
  { id: '27', code: '7340204 - HC08.01', name: 'Tài chính bảo hiểm', benchmark2025: 22.56, quota2025: 80, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Tài chính Bảo hiểm', url: 'https://youtu.be/NoFLW6XrWgU?si=JCIkiYoRtogKZtBY'}] },
  { id: '28', code: '7340301 - HC02.13', name: 'Kế toán DN; Kế toán công', benchmark2025: 25.01, quota2025: 460, quota2026: 550, isLanguageOrCCQT: false, group: 'CH', links: [
    {name: 'Kế toán Doanh nghiệp', url: 'https://youtu.be/6MGTl5nVg_4?si=f8KPx2nYdUPDay7U'},
    {name: 'Kế toán Công', url: 'https://youtu.be/5jX9XQo1ZQ0?si=DQu3T7GzU2MF5zVB'}
  ] },
  { id: '29', code: '7340302 - HC10.01', name: 'Kiểm toán', benchmark2025: 26.60, quota2025: 140, quota2026: 200, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Kiểm toán', url: 'https://youtu.be/mkFiNYo5sXo?si=5YQ7hqzGCU7rIfab'}] },
  { id: '30', code: '7340403 - HC07.01', name: 'Quản lý tài chính công', benchmark2025: 22.55, quota2025: 140, quota2026: 140, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Quản lý Tài chính công', url: 'https://youtu.be/3E2XXxO5vb8?si=jsIg5XsskP-mWkmN'}] },
  { id: '31', code: '7340405 - HC04.01', name: 'Tin học tài chính kế toán', benchmark2025: 25.07, quota2025: 90, quota2026: 90, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Tin học tài chính', url: 'https://youtu.be/pnkRjrOZupE?si=nBEKaWfmgwME00Q0'}] },
  { id: '32', code: '7380101 - HC17.01', name: 'Luật kinh doanh', benchmark2025: 25.12, quota2025: 50, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Luật Kinh doanh', url: 'https://youtu.be/ENPO8gUW4rc?si=6e33eb0VGJcztrm9'}] },
  { id: '33', code: '7460108 - HC14.01', name: 'Khoa học dữ liệu trong Tài chính', benchmark2025: 25.52, quota2025: 50, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'Khoa học dữ liệu trong Tài chính', url: 'https://youtu.be/oco-iV0Vdac?si=lwVHKNVYdWBrmfFS'}] },
  { id: '34', code: '7480201 - HC13.01', name: 'Trí tuệ nhân tạo trong TCKT', benchmark2025: 24.97, quota2025: 50, quota2026: 80, isLanguageOrCCQT: false, group: 'CH', links: [{name: 'AI trong Tài chính kế toán', url: 'https://youtu.be/XXbYf9R1iOM?si=PDGjbwr-HaYO4s48'}] },
  
  // DDP
  { id: '35', code: '7340201 - HC.DDP', name: 'Chương trình liên kết quốc tế DDP', benchmark2025: 24.00, quota2025: 120, quota2026: 120, isLanguageOrCCQT: true, group: 'DDP'}
];

// Cập nhật bảng quy đổi IELTS cho năm 2026 (Page 6 PDF)
export const IELTS_CONVERSION: Record<string, number> = {
  '5.5': 9.0,
  '6.0': 9.25,
  '6.5': 9.5,
  '7.0': 9.75,
  '7.5+': 10.0,
};

// Cập nhật bảng quy đổi Giải HSG năm 2026
export const HSG_CONVERSION: Record<string, number> = {
  'Ba Tỉnh': 9.0,
  'Nhì Tỉnh': 9.5,
  'Nhất Tỉnh/Khuyến Khích QG': 10.0,
};

export const ADMISSION_METHODS = [
  { id: 'PT2', name: 'Phương thức 2: Xét tuyển kết hợp', description: 'Gồm 3 nhóm đối tượng kết hợp chứng chỉ hoặc thi THPT.' },
  { id: 'PT3', name: 'Phương thức 3: Xét kết quả thi THPT', description: 'Sử dụng tổng điểm 3 môn tổ hợp kỳ thi tốt nghiệp 2026.' },
];

