"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_REPORT_LIST } from "../../lib/dummyData";
import { AppHeader } from "../../components/layout/app-header";
import { Card, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/auth-context";

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // 리다이렉트 중
  }

  return (
    <>
      <AppHeader />
      <main className="space-y-4 pb-6 px-4">
      <header className="space-y-2">
        <p className="text-[11px] text-foreground/60">마이페이지</p>
        <h1 className="text-lg font-semibold text-foreground">나의 운명 리포트</h1>
        <p className="text-xs text-foreground/70">
          지금까지 받아본 사주, 궁합, 운세 리포트를
          <br />
          언제든 다시 열어볼 수 있어요.
        </p>
      </header>

      <section className="space-y-2">
        {MOCK_REPORT_LIST.map((report) => (
          <Card
            key={report.id}
            className="bg-muted/80"
          >
            <CardHeader
              title={
                report.productType === "saju"
                  ? "사주 리포트"
                  : report.productType === "compat"
                  ? "궁합 리포트"
                  : "운세 리포트"
              }
              subtitle={report.summary.headline}
              icon={
                <span className="text-lg">
                  {report.productType === "saju"
                    ? "☾"
                    : report.productType === "compat"
                    ? "∞"
                    : "✶"}
                </span>
              }
            />
            <div className="flex items-center justify-between text-[11px] text-foreground/60">
              <span>
                생성일:{" "}
                {new Date(report.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-accent-gold">990원</span>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <Button
                as-child={true as never}
                fullWidth
              >
                <a href={report.productType === "saju" ? "/saju/result" : "#"}>
                  리포트 다시 보기
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                className="border-[#FEE500]/70 bg-transparent text-[11px] text-[#1F1F1F] hover:bg-[#FEE500]/15"
                onClick={() =>
                  alert("카카오톡 공유 더미 버튼입니다. SDK 연동 예정.")
                }
              >
                카카오톡으로 공유
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
    </>
  );
}

