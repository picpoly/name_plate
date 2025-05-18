import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴと説明 */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <Image src="/picpoly-logo.png" alt="PIC&POLY" width={180} height={50} className="mb-4" />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              PIC&POLYは、3Dフィギュアやグッズのオーダーメイドサービスを提供しています。
              あなたの好きや想いをカタチにします。
            </p>
          </div>

          {/* クイックリンク */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">サービス</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-[#f6be5a]">
                  商品一覧
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-600 hover:text-[#f6be5a]">
                  ご利用ガイド
                </Link>
              </li>
              <li>
                <Link href="/data-guide" className="text-gray-600 hover:text-[#f6be5a]">
                  データ制作ガイド
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-gray-600 hover:text-[#f6be5a]">
                  テンプレート
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 hover:text-[#f6be5a]">
                  レビュー
                </Link>
              </li>
            </ul>
          </div>

          {/* カスタマーサポート */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#f6be5a]">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#f6be5a]">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-[#f6be5a]">
                  配送について
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#f6be5a]">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#f6be5a]">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-xs">
          <p>&copy; {currentYear} PIC&POLY All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
