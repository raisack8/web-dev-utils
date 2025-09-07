'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';

type StringType = 'base32' | 'base64' | 'hex' | 'url-safe-base64';

export default function RandomStringGenerator() {
  const [length, setLength] = useState(12);
  const [stringType, setStringType] = useState<StringType>('base64');
  const [generatedString, setGeneratedString] = useState('');

  const getCharacterSet = (type: StringType): string => {
    switch (type) {
      case 'base32':
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      case 'base64':
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      case 'hex':
        return '0123456789ABCDEF';
      case 'url-safe-base64':
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      default:
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    }
  };

  const generateRandomString = async() => {
    const characters = getCharacterSet(stringType);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedString(result);
    // クリップボードにコピー
    try {
      await navigator.clipboard.writeText(result);
      toast.success("クリップボードにコピーしました。")
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
  };

  return (
    <Card className="w-full px-8 py-4 m-1">
      <h2 className="text-lg font-medium">ランダム文字列</h2>
      <div>
        <RadioGroup 
          value={stringType} 
          onValueChange={(value) => setStringType(value as StringType)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="base32" id="base32" />
            <Label htmlFor="base32">Base32</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="base64" id="base64" />
            <Label htmlFor="base64">Base64 (A-Z + a-z + 0-9 + +/)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hex" id="hex" />
            <Label htmlFor="hex">16進数 (0-9 + A-F)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url-safe-base64" id="url-safe-base64" />
            <Label htmlFor="url-safe-base64">URL-safe Base64 (A-Z + a-z + 0-9 + -_)</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label className="text-sm">文字数</Label>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-20">
            <Input 
              type="number" 
              value={length} 
              onChange={(e) => setLength(Number(e.target.value))}
              min="1"
            />
          </div>
          <Button onClick={generateRandomString}>生成</Button>
          <Label>{generatedString || '生成すると、ここに文字列が表示されます。'}</Label>
        </div>
      </div>
    </Card>
  );
}