export type ProductType = 'saju' | 'compat' | 'fortune';

export type ReportSection = {
  id: string;
  title: string;
  summary: string;
  body: string;
};

export type ReportCoreSummary = {
  headline: string;
  oneLiner: string;
  tone: 'bright' | 'calm' | 'warning';
};

export type Report = {
  id: string;
  userId: string;
  productType: ProductType;
  createdAt: string;
  price: number;
  summary: ReportCoreSummary;
  meta: Record<string, string>;
  sections: ReportSection[];
};

export type UserProfile = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
};

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type PaymentRecord = {
  id: string;
  userId: string;
  reportId: string | null;
  productType: ProductType;
  amount: number;
  status: PaymentStatus;
  provider: 'portone' | 'toss' | 'test';
  createdAt: string;
};

