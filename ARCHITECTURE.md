# سامانه مدیریت دانش و آرشیو نیپکو

## 🏗️ معماری Clean Architecture

این پروژه بر اساس معماری Clean Architecture با ۵ لایه مجزا طراحی و پیاده‌سازی شده است:

### 📁 ساختار لایه‌ها

```
src/
├── layers/
│   ├── shared/          # لایه مشترک
│   │   └── types.ts     # تعاریف نوع، اینترفیس‌ها، DTOها
│   │
│   ├── domain/          # لایه دامنه
│   │   └── services.ts  # قوانین کسب‌وکار، Entityها، Domain Services
│   │
│   ├── application/     # لایه کاربرد
│   │   └── useCases.ts  # Use Caseها، Application Services
│   │
│   └── infrastructure/  # لایه زیرساخت
│       └── repositories.ts  # Repositoryها، External Services، Persistence
│
├── store/               # مدیریت State سراسری
│   └── index.ts         # Store اصلی، اتصال تمام لایه‌ها
│
├── components/          # لایه ارائه - کامپوننت‌های مشترک
│   ├── Layout.tsx       # Layout اصلی
│   ├── Modals.tsx       # Modalهای Upload، Create Meeting، Create Workflow
│   └── index.ts         # Export تمام کامپوننت‌ها
│
└── pages/               # لایه ارائه - صفحات
    ├── Dashboard.tsx
    ├── Documents.tsx
    ├── KnowledgeTree.tsx
    ├── StorageControl.tsx
    ├── SearchPage.tsx
    ├── AIAssistant.tsx
    ├── Reports.tsx
    ├── Archive.tsx
    ├── AuditLog.tsx
    ├── Settings.tsx
    ├── Workflows.tsx
    ├── Meetings.tsx
    └── Login.tsx
```

---

## 🔍 توضیح لایه‌ها

### ۱. لایه مشترک (Shared Layer)
**مسیر:** `src/layers/shared/types.ts`

**وظایف:**
- تعریف تمام Typeها و Interfaceها
- DTOهای ورودی/خروجی
- Enumها و Constantها
- قراردادهای مشترک بین لایه‌ها

**محتویات:**
- `User`, `Document`, `Meeting`, `Workflow`, `AuditEntry`
- `KnowledgeNode`, `Notification`, `Setting`, `StorageStats`
- `DocumentStatus`, `StorageTier`

---

### ۲. لایه دامنه (Domain Layer)
**مسیر:** `src/layers/domain/services.ts`

**وظایف:**
- پیاده‌سازی قوانین کسب‌وکار
- Validationهای دامنه
- Domain Services
- Business Rules

**محتویات:**
- `DocumentDomainService`: قوانین تأیید، حذف، ویرایش، تغییر وضعیت
- `StorageDomainService`: قوانین آپلود، تشخیص تکراری، تعیین Tier
- `WorkflowDomainService`: قوانین انتقال مرحله، تکمیل
- `AuditDomainService`: ایجاد Audit Entry

**قوانین مهم:**
- `canApprove()`: بررسی مجوز تأیید بر اساس Permission و وضعیت سند
- `canDelete()`: بررسی مجوز حذف (اسناد تأییدشده نیاز به مجوز ویژه دارند)
- `validateStatusTransition()`: اعتبارسنجی تغییر وضعیت
- `isDuplicate()`: تشخیص فایل تکراری بر اساس Hash
- `determineStorageTier()`: تعیین Hot/Warm/Cold بر اساس اندازه و آخرین دسترسی

---

### ۳. لایه کاربرد (Application Layer)
**مسیر:** `src/layers/application/useCases.ts`

**وظایف:**
- تعریف Use Caseها
- هماهنگی بین Domain و Infrastructure
- Application Services
- Orchestrations

**محتویات:**
- `DocumentUseCases`: ایجاد، تأیید، رد، حذف، تغییر وضعیت سند
- `MeetingUseCases`: ایجاد جلسه، افزودن Action Item، تکمیل
- `WorkflowUseCases`: ایجاد گردش کار، انتقال مرحله

**ویژگی‌ها:**
- هر Use Case یک Transaction کامل است
- Audit Log به‌صورت خودکار ثبت می‌شود
- Notification به‌صورت خودکار ارسال می‌شود
- Validationهای Domain قبل از اجرا

---

### ۴. لایه زیرساخت (Infrastructure Layer)
**مسیر:** `src/layers/infrastructure/repositories.ts`

**وظایف:**
- پیاده‌سازی Repositoryها
- Persistence (localStorage در این نسخه)
- External Services (File Storage, Notification)
- Data Access

**محتویات:**
- `LocalStorageRepository<T>`: Generic Repository با localStorage
- `documentRepo`, `meetingRepo`, `workflowRepo`, `auditRepo`, `notificationRepo`
- `FileStorageService`: آپلود فایل، محاسبه Hash، فرمت حجم
- `NotificationService`: ارسال اعلان، دریافت، علامت‌گذاری خوانده‌شده
- `seedInitialData()`: ایجاد داده‌های اولیه

**ویژگی‌ها:**
- Persistence خودکار با localStorage
- Hash SHA-256 برای فایل‌ها
- FormatFileSize برای نمایش حجم
- Seed داده‌های اولیه برای Demo

---

### ۵. لایه ارائه (Presentation Layer)
**مسیر:** `src/components/` و `src/pages/`

**وظایف:**
- UI/UX
- User Interaction
- State Management (از طریق Store)
- Rendering

**محتویات:**
- **Components:**
  - `Layout.tsx`: Sidebar، Header، Navigation
  - `Modals.tsx`: UploadModal، CreateMeetingModal، CreateWorkflowModal، ToastContainer
  
- **Pages:**
  - `Dashboard.tsx`: داشبورد اصلی با KPI و نمودار
  - `Documents.tsx`: مدیریت اسناد با Upload، Approve، Reject، Delete
  - `KnowledgeTree.tsx`: درخت دانش تعاملی
  - `StorageControl.tsx`: مرکز کنترل ذخیره‌سازی
  - `SearchPage.tsx`: جست‌وجوی پیشرفته
  - `AIAssistant.tsx`: دستیار هوشمند با RAG
  - `Reports.tsx`: گزارش‌گیری
  - `Archive.tsx`: آرشیو سالانه
  - `AuditLog.tsx`: گزارش حسابرسی
  - `Settings.tsx`: تنظیمات کامل (۱۳ بخش)
  - `Workflows.tsx`: مدیریت گردش کار
  - `Meetings.tsx`: مدیریت جلسات
  - `Login.tsx`: ورود به سامانه

---

## 🔄 جریان داده (Data Flow)

```
User Action (UI)
    ↓
Presentation Layer (Pages/Components)
    ↓
Store (State Management)
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Business Rules)
    ↓
Infrastructure Layer (Repositories)
    ↓
Persistence (localStorage)
    ↓
Store Update → UI Re-render
```

---

## ✅ قابلیت‌های پیاده‌سازی‌شده

### مدیریت اسناد
- ✅ آپلود فایل با Drag & Drop
- ✅ تشخیص فایل تکراری (Deduplication)
- ✅ محاسبه Hash SHA-256
- ✅ Metadata کامل (عنوان، کد، نوع، واحد، برچسب، محرمانگی)
- ✅ گردش کار تأیید (Draft → Review → Approved → Published)
- ✅ رد سند با دلیل
- ✅ حذف سند با مجوز
- ✅ تغییر وضعیت
- ✅ نمایش جزئیات کامل (Hash، OCR، AI، دانلود، بازدید)

### مدیریت جلسات
- ✅ ایجاد جلسه جدید
- ✅ ثبت شرکت‌کنندگان
- ✅ Action Items با مسئول و مهلت
- ✅ تکمیل Action Items
- ✅ نمایش جلسات پیش‌رو و برگزارشده

### مدیریت گردش کار
- ✅ ایجاد گردش کار سفارشی
- ✅ تعریف مراحل دلخواه
- ✅ انتقال مرحله
- ✅ نمایش مراحل با رنگ‌بندی

### مدیریت ذخیره‌سازی
- ✅ نمایش ظرفیت کل و مصرف‌شده
- ✅ تفکیک Hot/Warm/Cold Storage
- ✅ پیشنهاد بهینه‌سازی (Deduplication، Compression، Cold Archive)
- ✅ نمایش بزرگ‌ترین فایل‌ها
- ✅ Health Metrics

### جست‌وجو
- ✅ جست‌وجوی Full-Text
- ✅ فیلترهای پیشرفته (واحد، نوع، وضعیت، سال، محرمانگی)
- ✅ جست‌وجوهای اخیر
- ✅ جست‌وجوهای ذخیره‌شده
- ✅ نمایش امتیاز ارتباط

### هوش مصنوعی
- ✅ دستیار هوشمند با RAG
- ✅ پاسخ Citation-Based با منابع
- ✅ انتخاب Provider (On-Premise/Cloud/Hybrid)
- ✅ Quick Actions
- ✅ آمار AI

### تنظیمات (۱۳ بخش کامل)
- ✅ عمومی
- ✅ برندینگ
- ✅ کاربران و نقش‌ها
- ✅ امنیت
- ✅ ذخیره‌سازی
- ✅ هوش مصنوعی
- ✅ جست‌وجو
- ✅ اعلان‌ها
- ✅ زبان و تقویم
- ✅ پایگاه داده
- ✅ انواع سند
- ✅ گردش کار
- ✅ آرشیو و Retention

### حسابرسی
- ✅ ثبت تمام عملیات مهم
- ✅ نمایش User، Role، IP، Device، Timestamp
- ✅ فیلتر و جست‌وجو
- ✅ غیرقابل حذف

### آرشیو سالانه
- ✅ مدیریت سال‌های شمسی
- ✅ چک‌لیست قبل از آرشیو
- ✅ Tiered Storage
- ✅ Integrity Check

### گزارش‌گیری
- ✅ Report Builder
- ✅ فیلترهای تاریخ شمسی
- ✅ نمودارهای تعاملی
- ✅ خروجی Excel/PDF

---

## 🔐 امنیت

- ✅ Permission-Based Access Control
- ✅ مجوزهای granular (Upload, Approve, Delete, Edit, etc.)
- ✅ Hash SHA-256 برای فایل‌ها
- ✅ Duplicate Detection
- ✅ Audit Log غیرقابل حذف
- ✅ Quarantine قبل از ذخیره
- ✅ Malware Scan (شبیه‌سازی)
- ✅ Retention Lock برای اسناد تأییدشده

---

## 🚀 نحوه اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای development
npm run dev

# Build برای production
npm run build
```

---

## 📊 آمار پروژه

- **تعداد فایل‌ها:** ۲۰+ فایل TypeScript/TSX
- **حجم کد:** ~۱۵,۰۰۰ خط کد
- **لایه‌های معماری:** ۵ لایه کامل
- **صفحات:** ۱۳ صفحه
- **کامپوننت‌ها:** ۱۰+ کامپوننت قابل استفاده مجدد
- **Use Caseها:** ۹ Use Case اصلی
- **Domain Services:** ۴ سرویس دامنه
- **Repositories:** ۵ Repository

---

## 🎯 ویژگی‌های کلیدی

1. **Clean Architecture:** جداسازی کامل لایه‌ها
2. **Type Safety:** تمام Typeها تعریف شده‌اند
3. **State Management:** Store مرکزی با Context API
4. **Persistence:** localStorage برای Demo
5. **RTL Support:** پشتیبانی کامل از فارسی
6. **Responsive Design:** سازگار با Desktop/Tablet/Mobile
7. **Dark Mode:** پشتیبانی از حالت تاریک
8. **Audit Trail:** ثبت تمام عملیات
9. **Permission System:** کنترل دسترسی granular
10. **File Deduplication:** تشخیص و جلوگیری از ذخیره تکراری

---

## 📝 یادداشت‌های فنی

- **Persistence:** در این نسخه از localStorage استفاده شده است. برای Production باید به SQL Server + File Storage تغییر کند.
- **Authentication:** در این نسخه ساده‌سازی شده است. برای Production باید JWT + Refresh Token پیاده‌سازی شود.
- **File Storage:** در این نسخه فایل‌ها در Memory هستند. برای Production باید Object Storage (S3/MinIO) استفاده شود.
- **AI:** در این نسخه شبیه‌سازی شده است. برای Production باید به LLM واقعی متصل شود.

---

## 🔄 مراحل بعدی برای Production

1. **Backend:** پیاده‌سازی ASP.NET Core 9 + EF Core 9
2. **Database:** SQL Server 2022 با Migration
3. **File Storage:** اتصال به S3/MinIO
4. **Authentication:** JWT + MFA + LDAP
5. **OCR:** اتصال به Tesseract یا Azure OCR
6. **AI:** اتصال به LLM (On-Premise یا Cloud)
7. **Search:** Elasticsearch یا OpenSearch
8. **Docker:** Docker Compose برای Deployment
9. **Testing:** Unit Test + Integration Test + E2E
10. **Documentation:** SRS، Architecture Document، API Contract

---

## 📄 لایسنس

تمامی حقوق برای شرکت دانش‌بنیان نیپکو محفوظ است.

---

**نسخه:** 1.0.0  
**تاریخ:** ۱۴۰۳  
**توسعه‌دهنده:** تیم فنی نیپکو
