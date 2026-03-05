# ছায়াবৃত (Chayabrito) — বাংলা অনলাইন সাহিত্য পত্রিকা

ছায়াবৃত একটি সম্পূর্ণ স্ট্যাটিক বাংলা অনলাইন সাহিত্য পত্রিকা, [Hugo](https://gohugo.io/) ব্যবহার করে তৈরি এবং [GitHub Pages](https://pages.github.com/)-এ হোস্ট করা।

## বৈশিষ্ট্যসমূহ

- **১১টি সাহিত্য বিভাগ** — কবিতা, গল্প, প্রবন্ধ, অনুবাদ, সাক্ষাৎকার, পাঠসূত্র, ধারাবাহিক, গান, ছড়া, সংবাদ, খোলা জানালা
- **ডার্ক মোড** — সিস্টেম প্রেফারেন্স ও ম্যানুয়াল টগল সমর্থন
- **ক্লায়েন্ট-সাইড সার্চ** — Fuse.js দিয়ে বিল্ড-টাইম JSON ইনডেক্স
- **পুশ নোটিফিকেশন** — Firebase Cloud Messaging (FCM)
- **SEO অপ্টিমাইজড** — Open Graph, Twitter Cards, Schema.org, sitemap, robots.txt
- **RSS ফিড** — কাস্টম RSS 2.0 ফিড
- **প্রিন্ট-ফ্রেন্ডলি** — প্রিন্ট মিডিয়া কোয়েরি সহ
- **রেসপন্সিভ ডিজাইন** — মোবাইল, ট্যাবলেট ও ডেস্কটপে সুন্দরভাবে দেখা যায়
- **রিডিং প্রগ্রেস বার** — আর্টিকেল পৃষ্ঠায় পড়ার অগ্রগতি দেখায়
- **লেখক প্রোফাইল** — বিস্তারিত লেখক পরিচিতি ও তাদের লেখার তালিকা
- **ফিচার্ড ক্যারাউজেল** — হোমপেজে ফিচার্ড আর্টিকেলের স্লাইডশো
- **রিলেটেড আর্টিকেল** — ক্যাটাগরি ও ট্যাগ ভিত্তিক সম্পর্কিত লেখা

## প্রযুক্তি

| উপাদান | প্রযুক্তি |
|---|---|
| SSG | Hugo Extended v0.145.0 |
| হোস্টিং | GitHub Pages |
| CI/CD | GitHub Actions |
| ফন্ট | Noto Serif Bengali, Noto Sans Bengali (Google Fonts) |
| সার্চ | Fuse.js v7.0.0 |
| নোটিফিকেশন | Firebase Cloud Messaging v10.12.0 |
| CSS | কাস্টম CSS, CSS Variables, Hugo Pipes |
| JS | ভ্যানিলা JavaScript, Hugo Pipes |

## প্রজেক্ট স্ট্রাকচার

```
chayabrito/
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions deployment
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   └── print.css         # Print styles
│   └── js/
│       ├── main.js           # Core JavaScript
│       ├── search.js         # Fuse.js search
│       └── fcm.js            # Firebase Cloud Messaging
├── content/
│   ├── _index.md             # Homepage
│   ├── about/_index.md       # About page
│   ├── archive/_index.md     # Archive page
│   ├── search/_index.md      # Search page
│   ├── articles/             # Article content (Markdown)
│   │   ├── _index.md
│   │   └── *.md
│   ├── authors/              # Author profiles
│   │   ├── _index.md
│   │   └── *.md
│   └── categories/           # Category index pages
│       └── {slug}/_index.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html       # Base template
│   │   ├── index.searchindex.json
│   │   └── rss.xml
│   ├── articles/
│   │   ├── single.html       # Article page
│   │   └── list.html         # Articles listing
│   ├── authors/
│   │   ├── single.html       # Author profile
│   │   └── list.html         # Author directory
│   ├── categories/
│   │   ├── list.html         # Single category
│   │   └── terms.html        # All categories
│   ├── about/list.html
│   ├── archive/list.html
│   ├── search/list.html
│   ├── index.html            # Homepage
│   ├── robots.txt
│   └── partials/             # Reusable components
│       ├── head.html
│       ├── header.html
│       ├── footer.html
│       ├── scripts.html
│       ├── article-card.html
│       ├── author-box.html
│       ├── breadcrumb.html
│       ├── hero.html
│       ├── reading-progress.html
│       ├── related-articles.html
│       └── social-share.html
├── static/
│   ├── firebase-messaging-sw.js
│   └── images/
│       └── favicon.ico
├── hugo.yaml                 # Hugo configuration
├── .gitignore
└── README.md
```

## সেটআপ ও ডেভেলপমেন্ট

### প্রয়োজনীয়তা

- [Hugo Extended](https://gohugo.io/installation/) v0.145.0 বা তার পরবর্তী সংস্করণ
- [Git](https://git-scm.com/)

### লোকাল ডেভেলপমেন্ট

```bash
# রিপোজিটরি ক্লোন করুন
git clone https://github.com/chayannito26/chayabrito.git
cd chayabrito

# Hugo ডেভ সার্ভার চালু করুন
hugo server -D

# ব্রাউজারে দেখুন: http://localhost:1313/chayabrito/
```

### প্রোডাকশন বিল্ড

```bash
hugo --minify
```

বিল্ড আউটপুট `public/` ফোল্ডারে তৈরি হবে।

## কন্টেন্ট ম্যানেজমেন্ট

### নতুন আর্টিকেল যোগ করা

`content/articles/` ফোল্ডারে নতুন `.md` ফাইল তৈরি করুন:

```yaml
---
title: "আর্টিকেলের শিরোনাম"
slug: "article-slug"
date: 2026-01-01
author: "author-slug"
categories: ["kobita"]
tags: ["ট্যাগ১", "ট্যাগ২"]
featured: false
image: "/images/articles/image.jpg"
excerpt: "সংক্ষিপ্ত বর্ণনা..."
seo_title: "SEO শিরোনাম"
seo_description: "SEO বর্ণনা"
---

এখানে আর্টিকেলের মূল বিষয়বস্তু লিখুন...
```

### ক্যাটাগরি স্লাগ ম্যাপিং

| বাংলা নাম | ইংরেজি স্লাগ |
|---|---|
| কবিতা | `kobita` |
| ছোটগল্প | `chotogolpo` |
| প্রবন্ধ | `probondho` |
| অনুবাদ | `onubad` |
| সাক্ষাৎকার | `shakkhatkar` |
| পাঠসূত্র | `pathosutro` |
| ধারাবাহিক | `dharabahik` |
| গান | `gaan` |
| ছড়া | `chora` |
| সংবাদ | `songbad` |
| খোলা জানালা | `khola-janala` |

### নতুন লেখক যোগ করা

`content/authors/` ফোল্ডারে নতুন `.md` ফাইল তৈরি করুন:

```yaml
---
title: "লেখকের নাম"
slug: "author-slug"
date: 2025-01-01
bio: "সংক্ষিপ্ত পরিচিতি"
photo: "/images/authors/photo.jpg"
social:
  facebook: "URL"
  twitter: "URL"
  email: "email@example.com"
---

বিস্তারিত পরিচিতি এখানে লিখুন...
```

## ডিপ্লয়মেন্ট

GitHub Pages-এ স্বয়ংক্রিয়ভাবে ডিপ্লয় হয় প্রতিটি `main` ব্রাঞ্চে পুশ করলে। GitHub Actions ওয়ার্কফ্লো (`.github/workflows/deploy.yml`) Hugo দিয়ে সাইট বিল্ড করে এবং GitHub Pages-এ আপলোড করে।

### সেটআপ

1. GitHub রিপোজিটরি সেটিংসে যান
2. Pages → Source: **GitHub Actions** নির্বাচন করুন
3. `hugo.yaml`-এ `baseURL` আপডেট করুন আপনার URL দিয়ে

## Firebase Cloud Messaging সেটআপ

পুশ নোটিফিকেশন ব্যবহার করতে হলে:

1. [Firebase Console](https://console.firebase.google.com/)-এ একটি প্রজেক্ট তৈরি করুন
2. Cloud Messaging সক্রিয় করুন
3. `hugo.yaml`-এ `params.firebase` সেকশনে আপনার Firebase কনফিগারেশন যোগ করুন
4. `static/firebase-messaging-sw.js`-এ Firebase কনফিগারেশন আপডেট করুন

## লাইসেন্স

কন্টেন্ট ও কোড সর্বস্বত্ব সংরক্ষিত © ছায়াবৃত পত্রিকা
