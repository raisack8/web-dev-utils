export interface NavigationItem {
  label: string
  path: string
  target?: string
}

export const navigationItems: NavigationItem[] = [
  {
    label: "文字列",
    path: "/string",
    target: undefined,
  },
  {
    label: "メモ",
    path: "/memo",
    target: undefined,
  },
  {
    label: "サンプル画像",
    path: "/sample-image",
    target: undefined,
  },
  {
    label: "認証",
    path: "/auth",
    target: undefined,
  },
  {
    label: "パフォーマンス",
    path: "/performance",
    target: undefined,
  },
  {
    label: "Redis",
    path: "/redis",
    target: undefined,
  },
  {
    label: "MyDocs",
    path: "https://raisack8.github.io/my-skill/",
    target: "_blank",
  },
]
