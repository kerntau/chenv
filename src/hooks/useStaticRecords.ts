import { useState } from 'react';
import { getAllRecords } from '../content';
import type { RecordItem } from '../types';

export function useStaticRecords() {
  const [records, setRecords] = useState<RecordItem[]>(() => getAllRecords());

  const saveRecord = (record: RecordItem) => {
    setRecords((prev) => [record, ...prev]);
  };

  const removeRecord = (id: string | number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return { records, saveRecord, removeRecord };
}
