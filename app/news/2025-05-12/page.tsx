import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* パンくずリスト */}
            <div className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#f6be5a]">
                ホーム
              </Link>{" "}
              &gt;{" "}
              <Link href="/news" className="hover:text-[#f6be5a]">
                お知らせ
              </Link>{" "}
              &gt; ECサイトをオープンしました！
            </div>

            {/* 記事ヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">ECサイトをオープンしました！</h1>
              <div className="text-gray-500 mb-4">2025年5月12日</div>
              <div className="border-b border-gray-200 pb-4"></div>
            </div>

            {/* 記事本文 */}
            <div className="prose max-w-none">
              <p className="mb-4">
                平素より格別のご高配を賜り、誠にありがとうございます。この度、PIC&POLYは新しいECサイトをオープンいたしました。
              </p>

              <p className="mb-4">
                新しいECサイトでは、3Dフィギュアやアクリルグッズなど、様��なオーダーメイド商品をオンラインでご注文いただけるようになりました。
                お客様のアイデアや想いを形にするお手伝いを、より便利にご利用いただけます。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">新サイトの特徴</h2>

              <ul className="list-disc pl-6 mb-6">
                <li className="mb-2">
                  <strong>簡単注文プロセス</strong>
                  ：商品選択からお支払いまで、シンプルで分かりやすい注文フローをご用意しました。
                </li>
                <li className="mb-2">
                  <strong>豊富な商品カテゴリー</strong>
                  ：人物フィギュアから動物キャラクター、ネームプレートまで幅広い商品をご用意しています。
                </li>
                <li className="mb-2">
                  <strong>データ制作ガイド</strong>
                  ：初めての方でも安心して注文できるよう、詳しいガイドをご用意しています。
                </li>
                <li className="mb-2">
                  <strong>お客様のオーダー紹介</strong>：過去のお客様の作品例をご覧いただけます。
                </li>
              </ul>

              <p className="mb-4">
                今後も、お客様のご要望にお応えできるよう、サービスの拡充と品質の向上に努めてまいります。
                何かご不明な点やご要望がございましたら、お気軽にお問い合わせください。
              </p>

              <p className="mb-8">PIC&POLYをどうぞよろしくお願いいたします。</p>

              <div className="text-center mb-8">
                <Link href="/products">
                  <Button className="bg-[#f6be5a] hover:bg-[#e5ad49]">商品一覧を見る</Button>
                </Link>
              </div>
            </div>

            {/* 戻るボタン */}
            <div className="mt-12">
              <Link href="/">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  トップページに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
