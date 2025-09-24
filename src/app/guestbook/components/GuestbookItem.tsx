import { GuestbookEntry } from "../types/guestbook";

interface GuestbookItemProps {
  entry: GuestbookEntry;
}

export default function GuestbookItem({ entry }: GuestbookItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {entry.identity ? entry.identity.charAt(0) : "匿"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {entry.identity || "匿名用户"}
            </h3>
            {entry.contact && (
              <p className="text-sm text-gray-500">
                {entry.contact.startsWith("@") ? `微信: ${entry.contact}` : `邮箱: ${entry.contact}`}
              </p>
            )}
          </div>
        </div>
        <time className="text-sm text-gray-500">
          {entry.createdAt}
        </time>
      </div>
      
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </div>
    </div>
  );
}
