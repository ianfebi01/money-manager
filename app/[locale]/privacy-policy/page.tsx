import Markdown from '@/components/Parsers/Markdown'
import { locales } from '@/i18n/config'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export async function generateMetadata( {
  params,
}: {
  params: { locale: string }
} ): Promise<Metadata> {
  const { locale } = params
  const t = await getTranslations( { locale, namespace : 'pages.privacy' } )

  const path = `/${locale}/privacy`
  
  return {
    title       : t( 'title' ),
    description : t( 'desc' ),
    alternates  : {
      canonical : path,
      languages : Object.fromEntries( locales.map( ( l ) => [l, `/${l}/privacy`] ) ),
    },
    openGraph : { url : path, title : t( 'title' ), description : t( 'desc' ) },
    twitter   : { title : t( 'title' ), description : t( 'desc' ) },
  }
}

export default function PrivacyPolicyPage() {
  const privacyContent = `
# Privacy Policy for Money Manager

**Last updated: July 21, 2025**

At **Money Manager**, we take your privacy seriously. This Privacy Policy outlines the information we collect and how we use it.

### 1. Information We Collect

When you sign in to Money Manager using **Google Login**, we collect the following information:

- Your **email address** associated with your Google account

We **do not** collect your name, profile picture, contacts, or any other personal information.

### 2. How We Use Your Information

We use your email address for the following purposes:

- To identify and authenticate you securely
- To associate your account and data within the Money Manager application

We do **not** share your email address with third parties.

### 3. Data Storage

All data is stored securely and used solely for providing the Money Manager service. We implement standard security measures to protect your information.

### 4. Third-Party Services

We use **Google OAuth** to allow users to log in securely. By using Google sign-in, you are also subject to Google’s [Privacy Policy](https://policies.google.com/privacy).

### 5. Your Consent

By using Money Manager, you consent to this privacy policy.

### 6. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page.

### 7. Contact

If you have any questions about this Privacy Policy, please contact us at:

📧 ianfebi01@gmail.com
`

  return (
    <main className="h-fit bg-dark grow">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 flex flex-col gap-4">
        <Markdown content={privacyContent} />
      </div>
    </main>
  )
}
