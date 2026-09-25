# ادامه مستندات پروژه — `README.md2`

> این فایل ادامه مستقیم `README.md` است. برای مطالعه یک مستند واحد، ابتدا `README.md` و سپس این فایل را بخوانید. در این مرحله فقط همین فایل ایجاد شده و به `README.md`، نام شاخه‌ها یا کدهای موجود دست زده نشده است.

## وضعیت ثبت‌شده در ادامه توسعه

### شناسنامه مخزن

- مخزن: `3nili15m-afk/sina-Studio-AI`
- شناسه مخزن: `1380818894`
- شاخه مورد استفاده برای مشاهده و ثبت تغییر: `main`
- ترکیب زبان گزارش‌شده: TypeScript با `98.9%` و Other با `1.1%`
- نسخه و وضعیت اعلام‌شده در `README.md`: `1.0.0` — Core Features Implemented - Production Development Phase
- آخرین تاریخ درج‌شده در `README.md`: `2026-09-09`

## آنچه در همین روند بررسی شد

در ادامه مستقیم کار، بدون بازسازی یا بازنویسی قابلیت‌های قبلی، وضعیت قابل مشاهده مخزن بررسی شد:

1. محتوای ریشه مخزن بررسی شد و وجود فایل‌ها و پوشه‌های اصلی زیر تأیید شد:
   - `.env.example`
   - `.github/`
   - `.gitignore`
   - `ARCHITECTURE.md`
   - `README.md`
   - `backend/`
   - `frontend/`
   - `mobile/`
2. ساختار سه بخش اصلی پروژه از راه GitHub بررسی شد:
   - Backend در `backend/`
   - Web frontend در `frontend/`
   - Mobile application در `mobile/`
3. در Backend وجود مسیرهای `api/`, `config/`, `database/`, `jobs/`, `orchestrator/`, `providers/`, `routing/`, `types/` و `utils/` و همچنین فایل‌های `app.ts` و `index.ts` تأیید شد.
4. فایل تست موجود `backend/tests/orchestrator.test.ts` شناسایی شد.
5. فایل‌های تنظیمات و اسکریپت‌ها در `backend/package.json`, `frontend/package.json` و `mobile/package.json` بررسی شدند.
6. جست‌وجوی مستقیم کد برای TODO/FIXME/NotImplemented در این محیط نتیجه قابل اتکایی نداد، چون ابزار جست‌وجوی کد دسترسی لازم به این مخزن را نداشت؛ بنابراین از آن نتیجه نمی‌توان برای اثبات نبودن کار ناتمام استفاده کرد.
7. یک تلاش قبلی برای ادامه توسعه انجام شد، اما در آن مرحله هیچ فایل کدی تغییر نکرد و هیچ تستی اجرا یا commit نشد. این وضعیت عمداً در این مستند ثبت شده تا پیشرفت واقعی با تغییرات فرضی اشتباه نشود.

## وضعیت قابلیت‌های اعلام‌شده در `README.md`

طبق مستند اصلی، موارد زیر به‌عنوان تکمیل‌شده اعلام شده‌اند و نباید در ادامه بدون نیاز دوباره‌سازی شوند:

- پایه Backend مبتنی بر Express.js
- چارچوب احراز هویت
- مدل‌ها و اتصال پایگاه داده
- یکپارچه‌سازی Provider مربوط به Agnes AI
- Endpointهای تولید Image، Video، Audio و Text-to-Speech
- Middlewareهای امنیتی شامل Helmet، CORS و rate limiting
- مدیریت خطا و logging

مواردی که در وضعیت فعلی `README.md` هنوز به‌صورت در حال انجام (`⏳`) ثبت شده‌اند:

- رابط کاربری Web frontend
- اپلیکیشن Mobile
- سیستم Job orchestration
- workflowهای ساخت بازی
- provider routing پیشرفته
- پیکربندی استقرار Production

Roadmap ثبت‌شده نیز این ترتیب را دارد: توسعه Web، توسعه Mobile، صف کار و orchestration، workflow ساخت بازی، انتخاب و routing پیشرفته Providerها، تست و تضمین کیفیت، بهینه‌سازی عملکرد، audit امنیتی و استقرار Production.

## سطح فعلی تست و Debug

در جریان همین چت:

- تست خودکار Backend، Frontend یا Mobile اجرا نشده است.
- build، type-check، lint یا validate اجرا نشده است.
- خطای runtime یا compile جدیدی مشاهده و رفع نشده است.
- هیچ قابلیت جدیدی به کد اضافه نشده است.
- بنابراین هیچ ادعایی درباره سبز بودن تست‌ها یا رفع باگ در این مرحله ثبت نمی‌شود.

اسکریپت‌های موجود برای ادامه اعتبارسنجی:

### Backend

```bash
cd backend
npm run type-check
npm run lint
npm test
npm run validate
```

Backend با Node.js نسخه `20+`، TypeScript، Jest، Express، MongoDB، Redis/Bull، Zod، Winston و Axios پیکربندی شده است.

### Frontend

```bash
cd frontend
npm run type-check
npm run lint
npm test
npm run build
npm run validate
```

Frontend با React، TypeScript، Vite، React Router، Redux Toolkit، Zustand، Material UI، Axios و Vitest پیکربندی شده است.

### Mobile

```bash
cd mobile
npm run type-check
npm run lint
```

Mobile با React Native، TypeScript، React Navigation، Axios، i18next و Zustand پیکربندی شده است.

## تصمیم‌های فنی ثبت‌شده

- معماری پروژه سه‌لایه/چندبخشی است: clientهای Web و Mobile از Backend API مبتنی بر Express استفاده می‌کنند.
- جریان تولید محتوا از API به Orchestrator، سپس Routing Layer و Provider Layer می‌رسد.
- Agnes AI به‌عنوان Provider فعلی در مستندات معرفی شده و Providerهای دیگر برای آینده در نظر گرفته شده‌اند.
- احراز هویت، اعتبارسنجی ورودی، rate limiting، logging، صف/پردازش ناهمگام و sandbox از ملاحظات اصلی معماری هستند.
- تنظیمات و secretها باید از فایل‌های `.env.example` و متغیرهای محیطی تأمین شوند؛ secret واقعی نباید commit شود.
- پشتیبانی فارسی/انگلیسی و RTL بخشی از هدف محصول است.

## منابعی که برای ادامه کار استفاده شدند

- `README.md` فعلی مخزن برای vision، معماری، وضعیت، roadmap، endpointها و فناوری‌ها.
- `ARCHITECTURE.md` برای بررسی معماری سطح بالا.
- `backend/package.json` برای اسکریپت‌های build/test/lint/type-check و وابستگی‌های Backend.
- `frontend/package.json` برای اسکریپت‌های build/test/lint/type-check و وابستگی‌های Web.
- `mobile/package.json` برای اسکریپت‌های lint/type-check و وابستگی‌های Mobile.
- ساختار پوشه‌های فعلی مخزن و `backend/tests/orchestrator.test.ts` برای تعیین محدوده کد و تست موجود.

## قاعده ادامه کار از این نقطه

ادامه‌دهنده باید از همین وضعیت ثبت‌شده حرکت کند، ابتدا فقط قابلیت‌های باقی‌مانده یا خطاهای واقعی را با تکیه بر کد موجود مشخص کند، و از بازسازی قابلیت‌های اعلام‌شده به‌عنوان تکمیل‌شده خودداری نماید. هر تغییر بعدی باید با تست مرتبط همان تغییر همراه باشد و نتیجه واقعی build، type-check، lint و test جداگانه ثبت شود.

## وضعیت این فایل

- این فایل تنها تغییر این مرحله است.
- `README.md` بدون تغییر باقی مانده است.
- نام شاخه‌ها و کدهای موجود بدون تغییر باقی مانده‌اند.
- این فایل برای ثبت context و جلوگیری از از دست رفتن وضعیت ادامه توسعه ایجاد شده است.
