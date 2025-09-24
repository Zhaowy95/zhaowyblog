"use client";

import ValineGuestbook from "@/components/guestbook/ValineGuestbook";

export default function GuestbookPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          欢迎在这里留下您的想法、建议或任何想说的话。我会认真阅读每一条留言！
        </p>
      </div>
      
      <ValineGuestbook />
    </div>
  );
}
