"use client";

import { useState } from "react";
import { Card, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

type PersonInfo = {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: string;
};

type CompatFormState = {
  personA: PersonInfo;
  personB: PersonInfo;
  relation: "lover" | "some" | "friend" | "";
};

type CompatFormErrors = {
  personA?: Partial<PersonInfo>;
  personB?: Partial<PersonInfo>;
  relation?: string;
};

export default function CompatInputPage() {
  const [form, setForm] = useState<CompatFormState>({
    personA: { name: "", birthDate: "", birthTime: "", gender: "" },
    personB: { name: "", birthDate: "", birthTime: "", gender: "" },
    relation: "",
  });
  const [errors, setErrors] = useState<CompatFormErrors>({});

  const updatePerson = (key: "personA" | "personB", field: keyof PersonInfo, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: "" },
    }));
  };

  const validate = (): boolean => {
    const nextErrors: CompatFormErrors = {};
    (["personA", "personB"] as const).forEach((who) => {
      const p = form[who];
      const e: Partial<PersonInfo> = {};
      if (!p.birthDate) e.birthDate = "생년월일을 입력해주세요.";
      if (!p.birthTime) e.birthTime = "출생시간을 입력해주세요.";
      if (!p.gender) e.gender = "성별을 선택해주세요.";
      if (Object.keys(e).length) {
        (nextErrors as any)[who] = e;
      }
    });
    if (!form.relation) nextErrors.relation = "관계 유형을 선택해주세요.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: API 연동 후 결과/결제 페이지로 이동
    alert("더미 제출: 실제 궁합 분석/결제는 추후 연동됩니다.");
  };

  const relationOptions = [
    { value: "lover", label: "연인" },
    { value: "some", label: "썸" },
    { value: "friend", label: "친구" },
  ] as const;

  const renderPersonCard = (label: string, key: "personA" | "personB") => {
    const person = form[key];
    const err = errors[key] || {};
    return (
      <Card className="bg-muted/70">
        <CardHeader
          title={label}
          subtitle="마음 속에 있는 그 사람을 떠올리며 정보를 입력해 주세요."
        />
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="block text-foreground/80">
              이름 (선택)
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent-gold focus:outline-none"
                placeholder="예: 별님"
                value={person.name}
                onChange={(e) => updatePerson(key, "name", e.target.value)}
              />
            </label>
          </div>

          <div className="space-y-1">
            <label className="block text-foreground/90">
              생년월일
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm text-foreground focus:border-accent-gold focus:outline-none"
                value={person.birthDate}
                onChange={(e) => updatePerson(key, "birthDate", e.target.value)}
              />
            </label>
            {err?.birthDate && (
              <p className="text-[11px] text-red-300">{err.birthDate}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-foreground/90">
              출생시간
              <input
                type="time"
                className="mt-1 w-full rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm text-foreground focus:border-accent-gold focus:outline-none"
                value={person.birthTime}
                onChange={(e) => updatePerson(key, "birthTime", e.target.value)}
              />
            </label>
            {err?.birthTime && (
              <p className="text-[11px] text-red-300">{err.birthTime}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-foreground/90">성별</p>
            <div className="flex gap-2">
              {[
                { value: "female", label: "여성" },
                { value: "male", label: "남성" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updatePerson(key, "gender", opt.value)}
                  className={`flex-1 rounded-full border px-3 py-2 text-xs transition ${
                    person.gender === opt.value
                      ? "border-accent-gold bg-accent-gold/20 text-foreground"
                      : "border-white/10 bg-background/60 text-foreground/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {err?.gender && (
              <p className="text-[11px] text-red-300">{err.gender}</p>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <main className="space-y-4 pb-6">
      <header className="space-y-2">
        <p className="text-[11px] text-foreground/60">궁합 · 두 사람의 온도 읽기</p>
        <h1 className="text-lg font-semibold text-foreground">
          둘 사이의 공기를
          <br />
          조용히 들여다볼게요
        </h1>
        <p className="text-xs text-foreground/70">
          연인, 썸, 친구… 이름은 달라도
          <br />
          두 사람만의 리듬과 간격을 섬세하게 짚어봅니다.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {renderPersonCard("나의 정보", "personA")}
        {renderPersonCard("상대방 정보", "personB")}

        <Card className="bg-muted/70">
          <CardHeader
            title="관계 유형"
            subtitle="지금 이 관계를 가장 가깝게 느껴지는 단어로 선택해 주세요."
          />
          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              {relationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, relation: opt.value }))}
                  className={`flex-1 rounded-full border px-3 py-2 text-xs transition ${
                    form.relation === opt.value
                      ? "border-accent-gold bg-accent-gold/20 text-foreground"
                      : "border-white/10 bg-background/60 text-foreground/70"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.relation && (
              <p className="text-[11px] text-red-300">{errors.relation}</p>
            )}
          </div>
        </Card>

        <div className="pt-1">
          <Button
            type="submit"
            fullWidth
          >
            둘의 궁합 분석하기
          </Button>
        </div>
      </form>
    </main>
  );
}

