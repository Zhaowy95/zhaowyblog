import { GuestbookEntry } from "../types/guestbook";
import GuestbookItem from "./GuestbookItem";

interface GuestbookListProps {
  entries: GuestbookEntry[];
}

export default function GuestbookList({ entries }: GuestbookListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📝</div>
        <p className="text-gray-500">还没有留言，来成为第一个留言的人吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">留言列表</h2>
        <span className="text-sm text-gray-500">
          共 {entries.length} 条留言
        </span>
      </div>
      
      <div className="space-y-4">
        {entries.map((entry) => (
          <GuestbookItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
