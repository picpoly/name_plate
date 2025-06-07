"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Share2, Info, Slash, X, Check, ExternalLink } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { useCart, type CartItem } from "@/context/cart-context"
import { v4 as uuidv4 } from "uuid"

export default function ProductPage() {
  const router = useRouter()
  const { addItem } = useCart()
  const materialTabRef = useRef(null)

  const [template, setTemplate] = useState("horizontal")
  const [charCount, setCharCount] = useState(1)
  const [price, setPrice] = useState(1300)
  const [baseTexture, setBaseTexture] = useState("normal") // "normal", "matte", "silk"
  const [textTexture, setTextTexture] = useState("normal") // "normal", "matte", "silk"
  const [baseColor, setBaseColor] = useState("#FFFFFF") // デフォルトは白
  const [baseColorName, setBaseColorName] = useState("ジェイドホワイト")
  const [textColor, setTextColor] = useState("#000000") // デフォルトは黒
  const [textColorName, setTextColorName] = useState("ブラック")
  const [inputText, setInputText] = useState("")
  const [selectedDecoration, setSelectedDecoration] = useState("none")
  const [selectedFont, setSelectedFont] = useState("overlapping")
  const [suffix, setSuffix] = useState("chan")
  const svgContainerRef = useRef(null)
  const [decorationError, setDecorationError] = useState(false)
  // 現在表示中のメイン画像を管理するステート
  const [currentMainImage, setCurrentMainImage] = useState("/nameplate-1.png")
  // カートに追加した後のフィードバックを表示するステート
  const [addedToCart, setAddedToCart] = useState(false)
  // 現在選択されているタブ
  const [activeTab, setActiveTab] = useState("price")
  // 現在のステップを管理するステート
  const [currentStep, setCurrentStep] = useState(1)

  // 商品画像の配列
  const productImages = [
    { src: "/nameplate-1.png", alt: "ネームプレートキーホルダー 縦書きと横書き" },
    { src: "/nameplate-2.png", alt: "ネームプレートキーホルダー カラーバリエーション" },
    { src: "/nameplate-3.png", alt: "ネームプレートキーホルダー ゴールド" },
    { src: "/nameplate-4.png", alt: "ネームプレートキーホルダー パープル" },
    { src: "/nameplate-5.png", alt: "ネームプレートキーホルダー サイズ表示" },
    { src: "/nameplate-usagi.png", alt: "ネームプレートキーホルダー うさぎちゃん" }, // この行を追加
  ]

  // 各セクションのポップオーバー開閉状態
  const [openPopovers, setOpenPopovers] = useState({
    template: false,
    font: false,
    decoration: false,
    texture: false,
    baseColor: false,
    textColor: false,
    preview: false,
    suffix: false,
    attachment: false,
    text: false,
  })

  // ポップオーバーの開閉を制御する関数
  const togglePopover = (name) => {
    setOpenPopovers({
      ...openPopovers,
      [name]: !openPopovers[name],
    })
  }

  // 質感タブに移動する関数
  const scrollToMaterialTab = () => {
    // タブを「質感・素材」タブに設定
    setActiveTab("material")

    // タブの切り替えが完了した後にスクロール
    setTimeout(() => {
      // タブコンテンツが表示されるようにする
      const tabsElement = document.getElementById("product-tabs")
      if (tabsElement) {
        // タブの位置までスクロール
        window.scrollTo({
          top: tabsElement.offsetTop - 100,
          behavior: "smooth",
        })

        // 質感・素材タブをアクティブにする
        const materialTabTrigger = document.querySelector('[data-state="active"][value="material"]')
        if (!materialTabTrigger) {
          const materialTab = document.querySelector('[value="material"]')
          if (materialTab) {
            ;(materialTab as HTMLElement).click()
          }
        }
      }
    }, 100)
  }

  // 装飾文字の配列
  const decorations = [
    { id: "none", name: "なし", icon: <Slash className="w-full h-full p-1" /> },
    { id: "ribbon", name: "リボン", image: "/decoration-ribbon.png" },
    { id: "heart-solid", name: "ハート", image: "/decoration-heart-solid.png" },
    { id: "heart-outline", name: "ハート（輪郭）", image: "/decoration-heart-outline.png" },
    { id: "flower", name: "花", image: "/decoration-flower.png" },
    { id: "crown", name: "王冠", image: "/decoration-crown.png" },
    { id: "star-outline", name: "星（輪郭）", image: "/decoration-star-outline.png" },
    { id: "cards", name: "トランプ", image: "/decoration-cards.png" },
    { id: "gem", name: "宝石", image: "/decoration-gem.png" },
    { id: "star-solid", name: "星", image: "/decoration-star-solid.png" },
    { id: "moon", name: "月", image: "/decoration-moon.png" },
  ]

  // アタッチメントの配列
  const attachments = [
    { id: "silver", name: "シルバー", image: "/attachment-silver.png" },
    { id: "pink-gold", name: "ピンクゴールド", image: "/attachment-pink-gold.png" },
    { id: "gold", name: "ゴールド", image: "/attachment-gold.png" },
  ]

  // カラーの配列（質感別）
  const colorsByTexture = {
    normal: [
      { name: "ジェイドホワイト", hex: "#FFFFFF" },
      { name: "マゼンタ", hex: "#EC008C" },
      { name: "ゴールド", hex: "#E4BD68" },
      { name: "ミスルトーグリーン", hex: "#3F8E43" },
      { name: "レッド", hex: "#C12E1F" },
      { name: "パープル", hex: "#5E43B7" },
      { name: "ベージュ", hex: "#F7E6DE" },
      { name: "ピンク", hex: "#F55A74" },
      { name: "サンフラワーイエロー", hex: "#FEC600" },
      { name: "ブロンズ", hex: "#847D48" },
      { name: "ターコイズ", hex: "#00B1B7" },
      { name: "インディゴパープル", hex: "#482960" },
      { name: "ライトグレー", hex: "#D1D3D5" },
      { name: "ホットピンク", hex: "#F5547C" },
      { name: "イエロー", hex: "#F4EE2A" },
      { name: "ココアブラウン", hex: "#6F5034" },
      { name: "シアン", hex: "#0086D6" },
      { name: "ブルーグレー", hex: "#5B6579" },
      { name: "シルバー", hex: "#A6A9AA" },
      { name: "オレンジ", hex: "#FF6A13" },
      { name: "ブライトグリーン", hex: "#BECF00" },
      { name: "ブラウン", hex: "#9D432C" },
      { name: "ブルー", hex: "#0A2989" },
      { name: "ダークグレー", hex: "#545454" },
      { name: "グレー", hex: "#8E9089" },
      { name: "パンプキンオレンジ", hex: "#FF9016" },
      { name: "バンブーグリーン", hex: "#00AE42" },
      { name: "マルーンレッド", hex: "#9D2235" },
      { name: "コバルトブルー", hex: "#0056B8" },
      { name: "ブラック", hex: "#000000" },
    ],
    matte: [
      { name: "アイボリーホワイト", hex: "#FFFFFF" },
      { name: "ボーンホワイト", hex: "#CBC6B8" },
      { name: "デザートタン", hex: "#E8DBB7" },
      { name: "ラテブラウン", hex: "#D3B7A7" },
      { name: "キャラメル", hex: "#AE835B" },
      { name: "テラコッタ", hex: "#B15533" },
      { name: "ダークブラウン", hex: "#7D6556" },
      { name: "ダークチョコレート", hex: "#4D3324" },
      { name: "ライラックパープル", hex: "#AE96D4" },
      { name: "さくらピンク", hex: "#E8AFCF" },
      { name: "マンダリンオレンジ", hex: "#F99963" },
      { name: "レモンイエロー", hex: "#F7D959" },
      { name: "プラム", hex: "#950051" },
      { name: "スカーレットレッド", hex: "#DE4343" },
      { name: "ダークレッド", hex: "#BB3D43" },
      { name: "ダークグリーン", hex: "#68724D" },
      { name: "グラスグリーン", hex: "#61C680" },
      { name: "アップルグリーン", hex: "#C2E189" },
      { name: "アイスブルー", hex: "#A3D8E1" },
      { name: "スカイブルー", hex: "#56B7E6" },
      { name: "マリンブルー", hex: "#0078BF" },
      { name: "ダークブルー", hex: "#042F56" },
      { name: "アッシュグレー", hex: "#9B9EA0" },
      { name: "ナルドグレー", hex: "#757575" },
      { name: "チャコール", hex: "#000000" },
    ],
    silk: [
      { name: "ゴールド", hex: "#F4A925" },
      { name: "シルバー", hex: "#C8C8C8" },
      { name: "チタングレー", hex: "#5F6367" },
      { name: "ブルー", hex: "#008BDA" },
      { name: "パープル", hex: "#8671CB" },
      { name: "キャンディレッド", hex: "#D02727" },
      { name: "キャンディグリーン", hex: "#018814" },
      { name: "ローズゴールド", hex: "#BA9594" },
      { name: "ベビーブルー", hex: "#A8C6EE" },
      { name: "ピンク", hex: "#F7ADA6" },
      { name: "ミント", hex: "#96DCB9" },
      { name: "シャンパン", hex: "#F3CFB2" },
      { name: "ホワイト", hex: "#FFFFFF" },
    ],
  }

  // 質感のカテゴリー
  const textureCategories = [
    { id: "normal", name: "ノーマル" },
    { id: "matte", name: "マット" },
    { id: "silk", name: "シルク（光沢）" },
  ]

  // 現在表示すべき色の配列を取得
  const getBaseColors = () => {
    return colorsByTexture[baseTexture] || []
  }

  const getTextColors = () => {
    return colorsByTexture[textTexture] || []
  }

  // 文字数に基づいて価格を計算する関数
  const calculatePrice = (count, template, hasDecoration) => {
    const basePrice = 1300
    const isFanStyle = template === "fan"

    // 装飾文字が「なし」の場合は文字数に加算しない
    const decorationCount = hasDecoration && hasDecoration !== "none" && !isFanStyle ? 1 : 0
    const totalCount = count + decorationCount

    if (isFanStyle) {
      // 推し活風の場合の料金表に基づいた計算
      if (totalCount <= 3) return basePrice

      // 4文字以上の場合、指定された料金表に従う
      const fanPrices = [
        1300,
        1300,
        1300, // 1-3文字
        1420,
        1540,
        1660,
        1780,
        1900,
        2020,
        2140, // 4-10文字
        2260,
        2380,
        2500,
        2620,
        2740,
        2860,
        2980,
        3100,
        3220,
        3340, // 11-20文字
      ]

      // 文字数が20を超える場合は、20文字の料金に120円×超過文字数を加算
      if (totalCount <= 20) {
        return fanPrices[totalCount - 1]
      } else {
        return fanPrices[19] + (totalCount - 20) * 120
      }
    } else {
      // 横書き・縦書きの場合は現在の計算方法を維持
      if (totalCount <= 4) return basePrice
      return basePrice + (totalCount - 4) * 120
    }
  }

  // テキスト入力時の処理
  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)

    // 「・」「、」「。」を除いた文字数をカウント
    const countableText = text.replace(/[・、。]/g, "")
    setCharCount(countableText.length)
    setPrice(calculatePrice(countableText.length, template, selectedDecoration))
  }

  // テンプレート変更時の処理
  const handleTemplateChange = (value) => {
    setTemplate(value)

    // 推し活風が選択された場合、装飾文字が「なし」なら警告を表示
    if (value === "fan" && selectedDecoration === "none") {
      setDecorationError(true)
    } else {
      setDecorationError(false)
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, value, selectedDecoration))
  }

  const handleBaseTextureChange = (value) => {
    setBaseTexture(value)
  }

  const handleTextTextureChange = (value) => {
    setTextTexture(value)
  }

  // ベースカラー選択時の処理
  const handleBaseColorChange = (colorHex, colorName) => {
    setBaseColor(colorHex)
    setBaseColorName(colorName)
  }

  // テキストカラー選択時の処理
  const handleTextColorChange = (colorHex, colorName) => {
    setTextColor(colorHex)
    setTextColorName(colorName)
  }

  // 装飾文字選択時の処理
  const handleDecorationChange = (decorationId) => {
    setSelectedDecoration(decorationId)

    // 推し活風が選択されている場合、装飾文字が「なし」なら警告を表示
    if (template === "fan" && decorationId === "none") {
      setDecorationError(true)
    } else {
      setDecorationError(false)
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, template, decorationId))
  }

  // フォント選択時の処理
  const handleFontChange = (fontId) => {
    setSelectedFont(fontId)
  }

  // 接尾辞選択時の処理
  const handleSuffixChange = (value) => {
    setSuffix(value)
  }

  // 選択された装飾文字の画像URLを取得
  const getDecorationImage = () => {
    const decoration = decorations.find((d) => d.id === selectedDecoration)
    return decoration ? decoration.image : null
  }

  // プレビューテキストを取得
  const getPreviewText = () => {
    if (inputText) {
      return template === "fan" ? `${inputText}${getSuffixText()}` : inputText
    }
    return template === "fan" ? `名前${getSuffixText()}` : "名前"
  }

  // 接尾辞のテキストを取得
  const getSuffixText = () => {
    switch (suffix) {
      case "chan":
        return "ちゃん"
      case "kun":
        return "くん"
      case "sama":
        return "さま"
      case "san":
        return "さん"
      case "oshi":
        return "推し"
      default:
        return "ちゃん"
    }
  }

  // フォントスタイルを取得
  const getFontStyle = () => {
    switch (selectedFont) {
      case "overlapping":
        return "font-bold tracking-wide"
      case "pop":
        return "font-bold tracking-normal"
      case "mincho":
        return "font-serif tracking-normal"
      default:
        return "font-bold tracking-wide"
    }
  }

  // テンプレートに基づいてSVGのパスを取得する関数を更新
  const getTemplateSvgPath = () => {
    if (template === "horizontal") return "/horizontal-template.svg"
    if (template === "vertical") return "/vertical-template.svg"
    return "/fan-template.svg"
  }

  // SVGを使用してプレビューをレンダリング
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    // コンテナをクリア
    container.innerHTML = ""

    // プレビューテキスト
    const displayText = inputText || "名前"
    const displaySuffix = template === "fan" ? getSuffixText() : ""
    const fullText = template === "fan" ? `${displayText}${displaySuffix}` : displayText

    // フォントスタイル
    let fontFamily = "sans-serif"
    let fontWeight = "bold"
    let letterSpacing = "normal"

    switch (selectedFont) {
      case "overlapping":
        fontWeight = "900"
        letterSpacing = "0.05em"
        break
      case "pop":
        fontWeight = "700"
        letterSpacing = "0.02em"
        break
      case "mincho":
        fontFamily = "serif"
        fontWeight = "500"
        letterSpacing = "0.03em"
        break
    }

    // SVGを直接生成
    let svgContent = ""

    if (template === "fan") {
      // 推し活風テンプレート
      svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      <path d="M50,150 C50,80 150,30 200,30 C250,30 350,80 350,150 C350,220 300,270 200,270 C100,270 50,220 50,150 Z" 
            fill="${baseColor}" stroke="#00000020" strokeWidth="1" filter="url(#shadow)" />
      <text x="200" y="150" textAnchor="middle" dominantBaseline="middle" 
            fontFamily="${fontFamily}" fontWeight="${fontWeight}" fontSize="36" 
            letterSpacing="${letterSpacing}" fill="${textColor}">
        ${fullText}
      </text>
      ${
        selectedDecoration !== "none"
          ? `<image x="260" y="90" width="40" height="40" href="${getDecorationImage()}" />`
          : ""
      }
    </svg>
  `
    } else if (template === "vertical") {
      // 縦書きテンプレート
      svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="50" y="50" width="100" height="300" rx="10" ry="10" 
            fill="${baseColor}" stroke="#00000020" strokeWidth="1" filter="url(#shadow)" />
      <text x="100" y="200" textAnchor="middle" dominantBaseline="middle" 
            fontFamily="${fontFamily}" fontWeight="${fontWeight}" fontSize="36" 
            writingMode="tb" letterSpacing="${letterSpacing}" fill="${textColor}">
        ${fullText}
      </text>
      ${
        selectedDecoration !== "none"
          ? `<image x="80" y="280" width="40" height="40" href="${getDecorationImage()}" />`
          : ""
      }
    </svg>
  `
    } else {
      // 横書きテンプレート
      svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      <rect x="50" y="50" width="300" height="100" rx="10" ry="10" 
            fill="${baseColor}" stroke="#00000020" strokeWidth="1" filter="url(#shadow)" />
      <text x="200" y="100" textAnchor="middle" dominantBaseline="middle" 
            fontFamily="${fontFamily}" fontWeight="${fontWeight}" fontSize="36" 
            letterSpacing="${letterSpacing}" fill="${textColor}">
        ${fullText}
      </text>
      ${
        selectedDecoration !== "none"
          ? `<image x="280" y="80" width="40" height="40" href="${getDecorationImage()}" />`
          : ""
      }
    </svg>
  `
    }

    // SVGをDOMに追加
    container.innerHTML = svgContent

    // 質感効果を追加
    const svgElement = container.querySelector("svg")
    if (svgElement) {
      // ベース要素を取得
      const baseElement = svgElement.querySelector("rect, path")
      if (baseElement) {
        // 質感に応じたフィルターを適用
        if (baseTexture === "matte") {
          baseElement.setAttribute("filter", "saturate(0.9) brightness(0.95)")
        } else if (baseTexture === "silk") {
          baseElement.setAttribute("filter", "url(#shadow) brightness(1.05) saturate(1.1)")
        }
      }

      // テキスト要素を取得
      const textElement = svgElement.querySelector("text")
      if (textElement) {
        // 質感に応じたフィルターを適用
        if (textTexture === "matte") {
          textElement.setAttribute("filter", "saturate(0.9) brightness(0.95)")
        } else if (textTexture === "silk") {
          textElement.setAttribute("filter", "brightness(1.05) saturate(1.1)")
        }
      }
    }
  }, [template, baseColor, textColor, baseTexture, textTexture, inputText, suffix, selectedFont, selectedDecoration])

  useEffect(() => {
    if (template === "fan" && selectedDecoration === "none") {
      setDecorationError(true)
    }

    // 初期価格を設定
    setPrice(calculatePrice(charCount, template, selectedDecoration))
  }, [])

  useEffect(() => {
    // 現在のURLをローカルストレージに保存
    localStorage.setItem("lastViewedProduct", window.location.pathname + window.location.search)
  }, [])

  // ページ読み込み時に一番上にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isAddToCartDisabled = () => {
    // 推し活風が選択されていて、装飾文字が「なし」の場合は無効
    return template === "fan" && selectedDecoration === "none"
  }

  // カートに商品を追加する関数
  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: uuidv4(), // ユニークID生成
      name: "ネームプレートキーホルダー",
      price: price,
      quantity: 1,
      image: currentMainImage,
      customizations: {
        template,
        font: selectedFont,
        decoration: selectedDecoration,
        baseColor,
        baseColorName,
        textColor,
        textColorName,
        text: inputText || "名前",
        baseTexture,
        textTexture,
        ...(template === "fan" && { suffix }),
      },
    }

    addItem(newItem)
    setAddedToCart(true)

    // カートページに遷移
    router.push("/cart")
  }

  // カートページに移動する関数
  const goToCart = () => {
    router.push("/cart")
  }

  // 次のステップに進む
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1)
    // ページを少し上にスクロール
    window.scrollTo({
      top: window.scrollY - 100,
      behavior: "smooth",
    })
  }

  // 前のステップに戻る
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1)
    // ページを少し上にスクロール
    window.scrollTo({
      top: window.scrollY - 100,
      behavior: "smooth",
    })
  }

  // カスタムポップオーバーコンポーネント
  const InfoPopover = ({ name, title, children }) => (
    <Popover open={openPopovers[name]} onOpenChange={(open) => setOpenPopovers({ ...openPopovers, [name]: open })}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-t-lg border-b">
          <h4 className="font-medium text-sm">{title}について</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpenPopovers({ ...openPopovers, [name]: false })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 text-sm space-y-2">{children}</div>
      </PopoverContent>
    </Popover>
  )

  // ステップコンポーネント
  const StepHeader = ({ number, title, description }) => (
    <div className="mb-6 border-b pb-4">
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          {number}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 ml-11">{description}</p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 商品画像とプレビュー */}
          <div className="w-full md:w-1/2">
            {/* メイン商品画像 - 選択された画像を表示 */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={currentMainImage || "/placeholder.svg"}
                alt="ネームプレートキーホルダー"
                fill
                className="object-contain"
                priority
                unoptimized={currentMainImage.startsWith("/texture/") || currentMainImage.startsWith("/decoration-")}
              />
            </div>
            {/* サブ画像ギャラリー - クリックで選択できるようにする */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                    currentMainImage === image.src ? "border-blue-500" : "border-transparent"
                  }`}
                  onClick={() => setCurrentMainImage(image.src)}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    unoptimized={image.src?.startsWith("/texture/") || image.src?.startsWith("/decoration-")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 商品情報 */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">ネームプレートキーホルダー</h1>

            <div className="mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">４〜7営業日で発送</Badge>
              <Badge variant="outline" className="ml-2">
                人気商品
              </Badge>
            </div>

            <p className="text-2xl font-bold mb-2">¥1,300〜</p>
            {/* 送料の記載を修正 */}
            <p className="text-sm text-green-600 font-semibold mb-2">
              オンライン販売開始記念！送料無料キャンペーン実施中！
            </p>
            <p className="text-sm text-muted-foreground mb-4">※制作内容によって金額が変動します。</p>
            <p className="text-sm text-muted-foreground mb-6">※この商品は注文個数で金額変動しません</p>

            <div className="space-y-6 mb-6">
              {/* ステップ1: デザインテンプレート選択 */}
              <div className={`border rounded-lg p-6 ${currentStep === 1 ? "bg-blue-50" : ""}`}>
                <StepHeader
                  number={1}
                  title="デザインテンプレートを選択"
                  description="ネームプレートの形状を選びましょう。横書き、縦書き、推し活風から選べます。"
                />

                <RadioGroup
                  defaultValue="horizontal"
                  className="grid grid-cols-3 gap-4"
                  onValueChange={handleTemplateChange}
                >
                  <div>
                    <RadioGroupItem value="horizontal" id="horizontal" className="peer sr-only" />
                    <Label
                      htmlFor="horizontal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="relative w-full aspect-square mb-2">
                        <Image
                          src="/horizontal-template.png"
                          alt="横書き"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span>横書き</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="vertical" id="vertical" className="peer sr-only" />
                    <Label
                      htmlFor="vertical"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="relative w-full aspect-square mb-2">
                        <Image src="/vertical-template.png" alt="縦書き" fill className="object-contain" unoptimized />
                      </div>
                      <span>縦書き</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="fan" id="fan" className="peer sr-only" />
                    <Label
                      htmlFor="fan"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="relative w-full aspect-square mb-2">
                        <Image src="/fan-template.png" alt="推し活風" fill className="object-contain" unoptimized />
                      </div>
                      <span>推し活風</span>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-6 flex justify-end">
                  <Button onClick={goToNextStep}>次へ進む</Button>
                </div>
              </div>

              {/* ステップ2: フォントと装飾文字 */}
              {currentStep >= 2 && (
                <div className={`border rounded-lg p-6 ${currentStep === 2 ? "bg-blue-50" : ""}`}>
                  <StepHeader
                    number={2}
                    title="フォントと装飾文字を選択"
                    description="文字のスタイルと装飾を選びましょう。推し活風の場合は装飾文字が必須です。"
                  />

                  {/* フォント選択 */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">フォント</h3>
                    </div>
                    <RadioGroup
                      defaultValue="overlapping"
                      className="grid grid-cols-3 gap-4"
                      onValueChange={handleFontChange}
                    >
                      <div>
                        <RadioGroupItem value="overlapping" id="overlapping" className="peer sr-only" />
                        <Label
                          htmlFor="overlapping"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="relative w-full aspect-square mb-2">
                            <Image
                              src="/font-overlapping.png"
                              alt="かさなり文字"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <span className="text-center">かさなり文字</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="pop" id="pop" className="peer sr-only" />
                        <Label
                          htmlFor="pop"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="relative w-full aspect-square mb-2">
                            <Image src="/font-pop.png" alt="ポップ" fill className="object-contain" unoptimized />
                          </div>
                          <span className="text-center">ポップ</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="mincho" id="mincho" className="peer sr-only" />
                        <Label
                          htmlFor="mincho"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="relative w-full aspect-square mb-2">
                            <Image src="/font-mincho.png" alt="明朝体" fill className="object-contain" unoptimized />
                          </div>
                          <span className="text-center">明朝体</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 装飾文字 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">装飾文字</h3>
                      <InfoPopover name="decoration" title="装飾文字">
                        <p>1つのみ選択可</p>
                        {template === "fan" && <p>※推し活風の場合は必須です</p>}
                        {template !== "fan" && <p>※横書き・縦書きの場合は1文字としてカウントされます</p>}
                        <p>「なし」を選ぶと追加料金はかかりません</p>
                      </InfoPopover>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {decorations.map((decoration, i) => (
                        <div key={i} className="relative">
                          {/* 推し活風の場合は「なし」を選択できないようにする */}
                          {!(template === "fan" && decoration.id === "none") && (
                            <>
                              <input
                                type="radio"
                                name="decoration"
                                id={`decoration-${i}`}
                                className="peer sr-only"
                                onChange={() => handleDecorationChange(decoration.id)}
                                checked={selectedDecoration === decoration.id}
                              />
                              <label
                                htmlFor={`decoration-${i}`}
                                className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer ${
                                  template === "fan" && decoration.id === "none" ? "opacity-50" : ""
                                }`}
                              >
                                <div className="relative w-full aspect-square">
                                  {decoration.icon ? (
                                    decoration.icon
                                  ) : (
                                    <Image
                                      src={decoration.image || "/placeholder.svg"}
                                      alt={decoration.name}
                                      fill
                                      className="object-contain p-1"
                                      unoptimized
                                    />
                                  )}
                                </div>
                                <span className="text-xs mt-1 text-center">{decoration.name}</span>
                              </label>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 推し活風の場合の接尾辞選択 */}
                  {template === "fan" && (
                    <div className="mt-6">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium">名前の後に付ける言葉</h3>
                        <InfoPopover name="suffix" title="名前の後に付ける言葉">
                          <p>推し活風テンプレートで名前の後に付ける言葉</p>
                          <p>「ちゃん」「くん」「さま」「さん」「推し」から選択できます</p>
                        </InfoPopover>
                      </div>
                      <Select defaultValue="chan" onValueChange={handleSuffixChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chan">ちゃん</SelectItem>
                          <SelectItem value="kun">くん</SelectItem>
                          <SelectItem value="sama">さま</SelectItem>
                          <SelectItem value="san">さん</SelectItem>
                          <SelectItem value="oshi">推し</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ3: カラー選択 */}
              {currentStep >= 3 && (
                <div className={`border rounded-lg p-6 ${currentStep === 3 ? "bg-blue-50" : ""}`}>
                  <StepHeader
                    number={3}
                    title="カラーを選択"
                    description="ベースカラーとテキストカラーの質感と色を選びましょう。"
                  />

                  {/* ベースカラー質感 */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">プレート本体の質感</h3>
                      <InfoPopover name="baseTexture" title="ベースカラー質感">
                        <p>ノーマル：標準的な光沢のある仕上がり</p>
                        <p>マット：落ち着いた質感の艶消し仕上げ</p>
                        <p>シルク：上品な光沢感のある特殊仕上げ</p>
                      </InfoPopover>
                      <a
                        href="https://colorcode.picpoly.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 flex items-center text-sm"
                      >
                        <span className="text-xs">カラーと質感について</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    {/* ベースカラー質感の説明画像 */}
                    <div className="my-3 p-2 border rounded-md bg-slate-50">
                      <p className="text-sm text-center text-slate-600 mb-2">プレート本体の質感と色を選びます。</p>
                      <div className="relative w-full aspect-[2/1] mb-2">
                        <Image
                          src="/base-selection-guide.png"
                          alt="ベースカラー選択ガイド"
                          fill
                          className="object-contain rounded"
                          unoptimized
                        />
                      </div>
                    </div>
                    <RadioGroup
                      defaultValue="normal"
                      className="grid grid-cols-3 gap-2"
                      onValueChange={handleBaseTextureChange}
                    >
                      {textureCategories.map((texture) => (
                        <div key={texture.id}>
                          <RadioGroupItem
                            value={texture.id}
                            id={`base-texture-${texture.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`base-texture-${texture.id}`}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            {texture.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* ベースカラー */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">プレート本体の色</h3>
                      <InfoPopover name="baseColor" title="ベースカラー">
                        <p>プレートの背景色を選択</p>
                        <p>選択した質感によって利用できる色が変わります</p>
                        <p>テキストカラーとのコントラストを考慮して選択してください</p>
                      </InfoPopover>
                    </div>
                    <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                      {getBaseColors().map((color, i) => (
                        <div key={`base-${i}`} className="relative">
                          <input
                            type="radio"
                            name="baseColor"
                            id={`base-color-${i}`}
                            className="peer sr-only"
                            onChange={() => handleBaseColorChange(color.hex, color.name)}
                            checked={baseColor === color.hex}
                          />
                          <label
                            htmlFor={`base-color-${i}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                            <span className="text-xs mt-1 text-center line-clamp-2">{color.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* テキストカラー質感 */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">文字部分の質感</h3>
                      <InfoPopover name="textTexture" title="テキストカラー質感">
                        <p>ノーマル：標準的な光沢のある仕上がり</p>
                        <p>マット：落ち着いた質感の艶消し仕上げ</p>
                        <p>シルク：上品な光沢感のある特殊仕上げ</p>
                      </InfoPopover>
                      <a
                        href="https://colorcode.picpoly.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 flex items-center text-sm"
                      >
                        <span className="text-xs">カラーと質感について</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    {/* テキストカラー質感の説明画像 */}
                    <div className="my-3 p-2 border rounded-md bg-slate-50">
                      <p className="text-sm text-center text-slate-600 mb-2">文字部分の質感と色を選びます。</p>
                      <div className="relative w-full aspect-[2/1] mb-2">
                        <Image
                          src="/text-selection-guide.png"
                          alt="テキストカラー選択ガイド"
                          fill
                          className="object-contain rounded"
                          unoptimized
                        />
                      </div>
                    </div>
                    <RadioGroup
                      defaultValue="normal"
                      className="grid grid-cols-3 gap-2"
                      onValueChange={handleTextTextureChange}
                    >
                      {textureCategories.map((texture) => (
                        <div key={texture.id}>
                          <RadioGroupItem
                            value={texture.id}
                            id={`text-texture-${texture.id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`text-texture-${texture.id}`}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            {texture.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* テキストカラー */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">文字部分の色</h3>
                      <InfoPopover name="textColor" title="テキストカラー">
                        <p>文字の色を選択</p>
                        <p>選択した質感によって利用できる色が変わります</p>
                        <p>ベースカラーとのコントラストを考慮して選択してください</p>
                      </InfoPopover>
                    </div>
                    <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                      {getTextColors().map((color, i) => (
                        <div key={`text-${i}`} className="relative">
                          <input
                            type="radio"
                            name="textColor"
                            id={`text-color-${i}`}
                            className="peer sr-only"
                            onChange={() => handleTextColorChange(color.hex, color.name)}
                            checked={textColor === color.hex}
                          />
                          <label
                            htmlFor={`text-color-${i}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                            <span className="text-xs mt-1 text-center line-clamp-2">{color.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ4: プレビューと文字入力 */}
              {currentStep >= 4 && (
                <div className={`border rounded-lg p-6 ${currentStep === 4 ? "bg-blue-50" : ""}`}>
                  <StepHeader number={4} title="文字を入力" description="プレートに入れる文字を入力しましょう。" />

                  {/* プレートに入れる文字 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">プレートに入れる文字</h3>
                      <InfoPopover name="text" title="プレートに入れる文字">
                        <p>プレートに入れる文字を入力（最大20文字）</p>
                        <p>ひらがな、カタカナ、漢字、英数字が使用可能</p>
                        <p>「・」「、」「。」は文字数にカウントされません</p>
                        <p>文字数によって料金が変動します</p>
                      </InfoPopover>
                    </div>
                    <Input
                      placeholder="名前やメッセージを入力"
                      maxLength={20}
                      value={inputText}
                      onChange={handleTextChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">20文字以内（残り{20 - inputText.length}文字）</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ※「・」「、」「。」は文字数にカウントされません
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ5: 注文確定 */}
              {currentStep >= 5 && (
                <div className={`border rounded-lg p-6 ${currentStep === 5 ? "bg-blue-50" : ""}`}>
                  <StepHeader
                    number={5}
                    title="注文内容の確認"
                    description="選択内容と金額を確認して、カートに追加しましょう。"
                  />

                  <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                    <h3 className="font-medium mb-2">注文内容</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">テンプレート:</span>{" "}
                        {template === "horizontal" ? "横書き" : template === "vertical" ? "縦書き" : "推し活風"}
                      </li>
                      <li>
                        <span className="font-medium">フォント:</span>{" "}
                        {selectedFont === "overlapping" ? "かさなり文字" : selectedFont === "pop" ? "ポップ" : "明朝体"}
                      </li>
                      <li>
                        <span className="font-medium">装飾文字:</span>{" "}
                        {decorations.find((d) => d.id === selectedDecoration)?.name || "なし"}
                      </li>
                      <li>
                        <span className="font-medium">ベースカラー:</span> {baseColorName}（
                        {baseTexture === "normal" ? "ノーマル" : baseTexture === "matte" ? "マット" : "シルク"}）
                      </li>
                      <li>
                        <span className="font-medium">テキストカラー:</span> {textColorName}（
                        {textTexture === "normal" ? "ノーマル" : textTexture === "matte" ? "マット" : "シルク"}）
                      </li>
                      <li>
                        <span className="font-medium">入力文字:</span> {inputText || "（未入力）"}
                      </li>
                      {template === "fan" && (
                        <li>
                          <span className="font-medium">接尾辞:</span>{" "}
                          {suffix === "chan"
                            ? "ちゃん"
                            : suffix === "kun"
                              ? "くん"
                              : suffix === "sama"
                                ? "さま"
                                : suffix === "san"
                                  ? "さん"
                                  : "推し"}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">合計金額:</span>
                      <span className="text-2xl font-bold">¥{price.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {(() => {
                        const decorationCount = selectedDecoration !== "none" && template !== "fan" ? 1 : 0
                        const totalCount = charCount + decorationCount

                        if (template === "fan") {
                          return totalCount > 3
                            ? `基本料金 ¥1,300 + 追加料金 ¥${((totalCount - 3) * 120).toLocaleString()} (${totalCount - 3}文字分)`
                            : "基本料金 ¥1,300"
                        } else {
                          return totalCount > 4
                            ? `基本料金 ¥1,300 + 追加料金 ¥${((totalCount - 4) * 120).toLocaleString()} (${totalCount - 4}文字分${decorationCount ? "・装飾文字含む" : ""})`
                            : "基本料金 ¥1,300"
                        }
                      })()}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {addedToCart ? (
                      <Button className="flex-1" size="lg" variant="outline" onClick={goToCart}>
                        <Check className="mr-2 h-5 w-5" />
                        カートに追加済み - カートへ進む
                      </Button>
                    ) : (
                      <Button className="flex-1" size="lg" disabled={isAddToCartDisabled()} onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        カートに追加
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mt-6 flex justify-start">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Tabs defaultValue="price" id="product-tabs">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="price">料金表</TabsTrigger>
                  <TabsTrigger value="details">詳細</TabsTrigger>
                  <TabsTrigger value="shipping">配送</TabsTrigger>
                  <TabsTrigger value="material">質感・素材</TabsTrigger>
                </TabsList>
                <TabsContent value="price" className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">文字数</th>
                          <th className="border px-4 py-2 text-left">横書き・縦書き (円)</th>
                          <th className="border px-4 py-2 text-left">推し活風 (円)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">1</td>
                          <td className="border px-4 py-2">¥1,300</td>
                          <td className="border px-4 py-2">¥1,300</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">2</td>
                          <td className="border px-4 py-2">¥1,300</td>
                          <td className="border px-4 py-2">¥1,300</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">3</td>
                          <td className="border px-4 py-2">¥1,300</td>
                          <td className="border px-4 py-2">¥1,300</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">4</td>
                          <td className="border px-4 py-2">¥1,300</td>
                          <td className="border px-4 py-2">¥1,420</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">5</td>
                          <td className="border px-4 py-2">¥1,420</td>
                          <td className="border px-4 py-2">¥1,540</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">6</td>
                          <td className="border px-4 py-2">¥1,540</td>
                          <td className="border px-4 py-2">¥1,660</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">7</td>
                          <td className="border px-4 py-2">¥1,660</td>
                          <td className="border px-4 py-2">¥1,780</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">8</td>
                          <td className="border px-4 py-2">¥1,780</td>
                          <td className="border px-4 py-2">¥1,900</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">9</td>
                          <td className="border px-4 py-2">¥1,900</td>
                          <td className="border px-4 py-2">¥2,020</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">10</td>
                          <td className="border px-4 py-2">¥2,020</td>
                          <td className="border px-4 py-2">¥2,140</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">11</td>
                          <td className="border px-4 py-2">¥2,140</td>
                          <td className="border px-4 py-2">¥2,260</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">12</td>
                          <td className="border px-4 py-2">¥2,260</td>
                          <td className="border px-4 py-2">¥2,380</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">13</td>
                          <td className="border px-4 py-2">¥2,380</td>
                          <td className="border px-4 py-2">¥2,500</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">14</td>
                          <td className="border px-4 py-2">¥2,500</td>
                          <td className="border px-4 py-2">¥2,620</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">15</td>
                          <td className="border px-4 py-2">¥2,620</td>
                          <td className="border px-4 py-2">¥2,740</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">16</td>
                          <td className="border px-4 py-2">¥2,740</td>
                          <td className="border px-4 py-2">¥2,860</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">17</td>
                          <td className="border px-4 py-2">¥2,860</td>
                          <td className="border px-4 py-2">¥2,980</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">18</td>
                          <td className="border px-4 py-2">¥2,980</td>
                          <td className="border px-4 py-2">¥3,100</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">19</td>
                          <td className="border px-4 py-2">¥3,100</td>
                          <td className="border px-4 py-2">¥3,220</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">20</td>
                          <td className="border px-4 py-2">¥3,220</td>
                          <td className="border px-4 py-2">¥3,340</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    ※装飾文字を選択した場合、横書き・縦書きでは1文字としてカウントされます。
                  </p>
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>高品質PLA素材使用</li>
                    <li>カスタマイズ可能なテキスト（1〜20文字）</li>
                    <li>3種類のフォントスタイル</li>
                    <li>10種類の装飾文字（オプション）</li>
                    <li>全68色から2色まで選択可能</li>
                    <li>3種類のアタッチメント（無料）</li>
                    <li>耐久性に優れた設計</li>
                    <li>サイズ：約6.3cm×2cm（デザインにより多少異なります）</li>
                  </ul>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">素材について</h3>
                    <p className="text-sm text-gray-600">
                      当店のネームプレートキーホルダーは、高品質なPLA素材を使用しています。PLAは環境に優しいバイオプラスチックで、耐久性と美しい発色が特徴です。日常使いに十分な強度を持ちながらも、軽量で持ち運びに便利です。
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">送料</h3>
                      {/* 送料の記載を修正 */}
                      <p className="text-green-600 font-semibold">
                        オンライン販売開始記念！送料無料キャンペーン実施中！
                      </p>
                      <p className="text-sm text-gray-500 mt-1">通常送料: 全国一律185円（税込）</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">配送期間</h3>
                      <p>通常配送: 4-7営業日以内に発送</p>
                      <p className="text-sm text-gray-500 mt-1">
                        ※ご注文状況や繁忙期により、発送までにさらにお時間をいただく場合がございます。
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">配送業者</h3>
                      <p>日本郵便またはヤマト運輸</p>
                      <p className="text-sm text-gray-500 mt-1">
                        ※配送業者のご指定はできません。あらかじめご了承ください。
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="material" className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">ノーマル質感</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        標準的な光沢のある仕上がりで、鮮やかな発色が特徴です。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/normal-white.png"
                              alt="ノーマル質感（白）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ホワイト</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/normal-red.png"
                              alt="ノーマル質感（赤）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">レッド</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/normal-black.png"
                              alt="ノーマル質感（黒）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ブラック</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">マット質感</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        落ち着いた艶消し仕上げで、上品で高級感のある質感です。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/matte-white.png"
                              alt="マット質感（白）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ホワイト</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/matte-red.png"
                              alt="マット質感（赤）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">レッド</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/matte-black.png"
                              alt="マット質感（黒）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ブラック</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">シルク質感</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        上品な光沢感のある特殊仕上げで、輝きと深みのある表現が可能です。
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/silk-white.png"
                              alt="シルク質感（白）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ホワイト</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/silk-red.png"
                              alt="シルク質感（赤）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">レッド</div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src="/texture/silk-black.png"
                              alt="シルク質感（黒）"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="p-2 text-center text-sm">ブラック</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">質感の選び方</h3>
                      <p className="text-sm text-gray-600">
                        ノーマル質感は鮮やかな発色で、カジュアルな印象に。マット質感は落ち着いた雰囲気で高級感を演出。シルク質感は光沢感があり、特別感のあるデザインに最適です。ベースカラーとテキストカラーで異なる質感を組み合わせることで、より個性的な仕上がりになります。
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
