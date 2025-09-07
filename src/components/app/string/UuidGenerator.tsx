'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UuidGenerator() {
  const [generatedUuid, setGeneratedUuid] = useState('');

  const generateUuid = async () => {
    // UUID v4の生成（xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx形式）
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setGeneratedUuid(uuid);
    
    // クリップボードにコピー
    try {
      await navigator.clipboard.writeText(uuid);
      toast.success("クリップボードにコピーしました。")
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
  };

  return (
    <Card className="w-full px-8 py-4 m-1">
      <p className="text-lg font-medium">UUID生成</p>
      <div className="flex items-center gap-2">
        <Button onClick={generateUuid}>生成</Button>
        <Label>{generatedUuid || '生成すると、ここに文字列が表示されます。'}</Label>
      </div>
    </Card>
  );
}