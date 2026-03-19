/**
 * 사업자 정보 푸터 (saju·로그인·결제·마이페이지 등에 표시)
 */
export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-white/[0.06] bg-black/40 px-4 py-5 text-[10px] leading-relaxed text-white/45"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <p className="mb-2 font-medium text-white/55">사업자 정보</p>
      <ul className="space-y-1 break-keep">
        <li>
          <span className="text-white/40">상호명</span>{' '}
          <span className="text-white/60">무드오프</span>
        </li>
        <li>
          <span className="text-white/40">대표자명</span>{' '}
          <span className="text-white/60">조태환</span>
        </li>
        <li>
          <span className="text-white/40">사업자등록번호</span>{' '}
          <span className="text-white/60">832-14-02697</span>
        </li>
        <li>
          <span className="text-white/40">사업장 주소</span>{' '}
          <span className="text-white/60">서울시 상왕십리동 750</span>
        </li>
        <li>
          <span className="text-white/40">유선번호</span>{' '}
          <span className="text-white/60">010-3370-9045</span>
        </li>
      </ul>
    </footer>
  );
}
