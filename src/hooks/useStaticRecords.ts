import { useCallback, useEffect, useState } from 'react';
import { getAllRecords } from '../content';
import type { RecordItem } from '../types';

const KEY = 'cot-static-records-v1';

const read = (): RecordItem[] => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as RecordItem[];
  } catch { /* ignore malformed browser data */ }
  return getAllRecords();
};

export function useStaticRecords() {
  const [records, setRecords] = useState<RecordItem[]>(read);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(records));
  }, [records]);

  const saveRecord = useCallback((record: RecordItem) => {
    setRecords((current) => {
      const next = current.some((item) => String(item.id) === String(record.id))
        ? current.map((item) => String(item.id) === String(record.id) ? record : item)
        : [record, ...current];
      return next.sort((a, b) => Number(b.createTime) - Number(a.createTime));
    });
  }, []);

  const removeRecord = useCallback((id: string | number) => {
    setRecords((current) => current.filter((item) => String(item.id) !== String(id)));
  }, []);

  return { records, saveRecord, removeRecord };
}
