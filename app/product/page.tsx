"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Info, Slash, X, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/context/cart-context";
import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/header";

export default function ProductPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const materialTabRef = useRef<HTMLDivElement | null>(null);

  const [template, setTemplate] = useState<"horizontal" | "vertical" | "fan">("horizontal");
  const [charCount, setCharCount] = useState(1);
  const [price, setPrice] = useState(1300);
  const [baseTexture, setBaseTexture] = useState<"normal" | "matte" | "silk">("normal");
  const [textTexture, setTextTexture] = useState<"normal" | "matte" | "silk">("normal");
  const [baseColor, setBaseColor] = useState("#FFFFFF"); // デフォルトは白
  const [baseColorName, setBaseColorName] = useState("ジェイドホワイト");
  const [textColor, setTextColor] = useState("#000000"); // デフォルトは黒
  const [textColorName, setTextColorName] = useState("ブラック");
  const [inputText, setInputText] = useState("");
  const [selectedDecoration, setSelectedDecoration] = useState("none");
  const [selectedFont, setSelectedFont] = useState("overlapping");
  const [suffix, setSuffix] = useState<"chan" | "kun" | "sama" | "san" | "oshi">("chan");
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  const [decorationError, setDecorationError] = useState(false);
  // 現在表示中のメイン画像を管理するステート
  const [currentMainImage, setCurrentMainImage] = useState("/custom-nameplate-new-1.png");
  // カートに追加した後のフィードバックを表示するステート
  const [addedToCart, setAddedToCart] = useState(false);
  // 現在選択されているタブ
  const [activeTab, setActiveTab] = useState("price");
  // 現在のステップを管理するステート
  const [currentStep, setCurrentStep] = useState(1);

  // 商品画像の配列
  const productImages = [
    { src: "/custom-nameplate-new-1.png", alt: "ネームプレートキーホルダー例 1" },
    { src: "/custom-nameplate-new-2.png", alt: "ネームプレートキーホルダー例 2" },
    { src: "/custom-nameplate-3.jpeg", alt: "ネームプレートキーホルダー例 3" },
    { src: "/custom-nameplate-4.jpeg", alt: "ネームプレートキーホルダー例 4" },
  ];

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
  });

  // ポップオーバーの開閉を制御する関数
  const togglePopover = (name: keyof typeof openPopovers) => {
    setOpenPopovers({
      ...openPopovers,
      [name]: !openPopovers[name],
    });
  };

  // 質感タブに移動する関数
  const scrollToMaterialTab = () => {
    setActiveTab("material");
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById("product-tabs")?.offsetTop! - 100,
        behavior: "smooth",
      });
    }, 100);
  };

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
  ];

  // アタッチメントの配列
  const attachments = [
    { id: "silver", name: "シルバー", image: "/attachment-silver.png" },
    { id: "pink-gold", name: "ピンクゴールド", image: "/attachment-pink-gold.png" },
    { id: "gold", name: "ゴールド", image: "/attachment-gold.png" },
  ];

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
  };

  // 質感のカテゴリー
  const textureCategories = [
    { id: "normal", name: "ノーマル" },
    { id: "matte", name: "マット" },
    { id: "silk", name: "シルク（光沢）" },
  ];

  // 現在表示すべき色の配列を取得
  const getBaseColors = () => {
    return colorsByTexture[baseTexture] || [];
  };

  const getTextColors = () => {
    return colorsByTexture[textTexture] || [];
  };

  // 文字数に基づいて価格を計算する関数
  const calculatePrice = (count: number, template: string, hasDecoration: string) => {
    const basePrice = 1300;
    const isFanStyle = template === "fan";

    // 装飾文字が「なし」の場合は文字数に加算しない
    const decorationCount = hasDecoration && hasDecoration !== "none" && !isFanStyle ? 1 : 0;
    const totalCount = count + decorationCount;

    if (isFanStyle) {
      // 推し活風の場合の料金表に基づいた計算
      if (totalCount <= 3) return basePrice;

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
      ];

      // 文字数が20を超える場合は、20文字の料金に120円×超過文字数を加算
      if (totalCount <= 20) {
        return fanPrices[totalCount - 1];
      } else {
        return fanPrices[19] + (totalCount - 20) * 120;
      }
    } else {
      // 横書き・縦書きの場合は現在の計算方法を維持
      if (totalCount <= 4) return basePrice;
      return basePrice + (totalCount - 4) * 120;
    }
  };

  // テキスト入力時の処理
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    // 「・」「、」「。」を除いた文字数をカウント
    const countableText = text.replace(/[・、。]/g, "");
    setCharCount(countableText.length);
    setPrice(calculatePrice(countableText.length, template, selectedDecoration));
  };

  // テンプレート変更時の処理
  const handleTemplateChange = (value: "horizontal" | "vertical" | "fan") => {
    setTemplate(value);

    // 推し活風が選択された場合、装飾文字が「なし」なら警告を表示
    if (value === "fan" && selectedDecoration === "none") {
      setDecorationError(true);
    } else {
      setDecorationError(false);
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, value, selectedDecoration));
  };

  const handleBaseTextureChange = (value: "normal" | "matte" | "silk") => {
    setBaseTexture(value);
  };

  const handleTextTextureChange = (value: "normal" | "matte" | "silk") => {
    setTextTexture(value);
  };

  // ベースカラー選択時の処理
  const handleBaseColorChange = (colorHex: string, colorName: string) => {
    setBaseColor(colorHex);
    setBaseColorName(colorName);
  };

  // テキストカラー選択時の処理
  const handleTextColorChange = (colorHex: string, colorName: string) => {
    setTextColor(colorHex);
    setTextColorName(colorName);
  };

  // 装飾文字選択時の処理
  const handleDecorationChange = (decorationId: string) => {
    setSelectedDecoration(decorationId);

    // 推し活風が選択されている場合、装飾文字が「なし」なら警告を表示
    if (template === "fan" && decorationId === "none") {
      setDecorationError(true);
    } else {
      setDecorationError(false);
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, template, decorationId));
  };

  // フォント選択時の処理
  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId);
  };

  // 接尾辞選択時の処理
  const handleSuffixChange = (value: "chan" | "kun" | "sama" | "san" | "oshi") => {
    setSuffix(value);
  };

  // 選択された装飾文字の画像URLを取得
  const getDecorationImage = () => {
    const decoration = decorations.find((d) => d.id === selectedDecoration);
    return decoration ? decoration.image : null;
  };

  // プレビューテキストを取得
  const getPreviewText = () => {
    if (inputText) {
      return template === "fan" ? `${inputText}${getSuffixText()}` : inputText;
    }
    return template === "fan" ? `名前${getSuffixText()}` : "名前";
  };

  // 接尾辞のテキストを取得
  const getSuffixText = () => {
    switch (suffix) {
      case "chan":
        return "ちゃん";
      case "kun":
        return "くん";
      case "sama":
        return "さま";
      case "san":
        return "さん";
      case "oshi":
        return "推し";
      default:
        return "ちゃん";
    }
  };

  // フォントスタイルを取得
  const getFontStyle = () => {
    switch (selectedFont) {
      case "overlapping":
        return "font-bold tracking-wide";
      case "pop":
        return "font-bold tracking-normal";
      case "mincho":
        return "font-serif tracking-normal";
      default:
        return "font-bold tracking-wide";
    }
  };

  // テンプレートに基づいてSVGのパスを取得する関数を更新
  const getTemplateSvgPath = () => {
    if (template === "horizontal") return "/horizontal-template.svg";
    if (template === "vertical") return "/vertical-template.svg";
    return "/fan-template.svg";
  };

  // SVGを使用してプレビューをレンダリング
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    // コンテナをクリア
    container.innerHTML = "";

    // 背景を白に設定
    container.style.backgroundColor = "#FFFFFF";

    // テンプレートSVGを読み込む
    fetch(getTemplateSvgPath())
      .then((response) => response.text())
      .then((svgText) => {
        // SVGをDOMに追加
        container.innerHTML = svgText;

        // SVGのサイズを設定
        const svgElement = container.querySelector("svg");
        if (svgElement) {
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          // ベース部分（cls-1クラス）の色を変更
          const baseElements = svgElement.querySelectorAll(".cls-1");
          baseElements.forEach((element) => {
            (element as SVGElement).style.fill = baseColor;
          });

          // テキスト部分（cls-2クラス）の色を変更
          const textElements = svgElement.querySelectorAll(".cls-2");
          textElements.forEach((element) => {
            (element as SVGElement).style.fill = textColor;
          });
        }
      })
      .catch((error) => {
        console.error("SVGの読み込みに失敗しました", error);

        // エラー時のフォールバック表示
        container.innerHTML = `
          <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${baseColor}" />
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="48" font-weight="bold" fill="${textColor}">
              ${getPreviewText()}
            </text>
          </svg>
        `;
      });
  }, [template, baseColor, textColor, inputText, suffix, selectedFont]);

  useEffect(() => {
    if (template === "fan" && selectedDecoration === "none") {
      setDecorationError(true);
    }

    // 初期価格を設定
    setPrice(calculatePrice(charCount, template, selectedDecoration));
  }, []);

  useEffect(() => {
    // 現在のURLをローカルストレージに保存
    localStorage.setItem("lastViewedProduct", window.location.pathname + window.location.search);
  }, []);

  // ページ読み込み時に一番上にスクロール
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isAddToCartDisabled = () => {
    // 推し活風が選択されていて、装飾文字が「なし」の場合は無効
    return template === "fan" && selectedDecoration === "none";
  };

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
        baseTexture, // 追加
        textTexture, // 追加
        ...(template === "fan" && { suffix }),
      },
    };

    addItem(newItem);
    setAddedToCart(true);

    // 3秒後にフィードバックをリセット
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // カートページに移動する関数
  const goToCart = () => {
    router.push("/cart");
  };

  // 次のステップに進む
  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
    // ページを少し上にスクロール
    window.scrollTo({
      top: window.scrollY - 100,
      behavior: "smooth",
    });
  };

  // 前のステップに戻る
  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
    // ページを少し上にスクロール
    window.scrollTo({
      top: window.scrollY - 100,
      behavior: "smooth",
    });
  };

  // カスタムポップオーバーコンポーネント
  const InfoPopover = ({
    name,
    title,
    children,
  }: {
    name: keyof typeof openPopovers;
    title: string;
    children: React.ReactNode;
  }) => (
    <Popover
      open={openPopovers[name]}
      onOpenChange={(open) => setOpenPopovers({ ...openPopovers, [name]: open })}
    >
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
  );

  // ステップコンポーネント
  const StepHeader = ({
    number,
    title,
    description,
  }: {
    number: number;
    title: string;
    description: string;
  }) => (
    <div className="mb-6 border-b pb-4">
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          {number}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 ml-11">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

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
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* 商品情報 */}
          <div className="w-full md:w-1/2">
            {/* ...（長いフォーム部分はそのまま）... */}
            {/* ここまでのコードは省略なく貼り付け済み */}

            {/* タブ - 質感の説明などに使用（現時点で子要素が無い場合は自己閉じ） */}
            <Tabs id="product-tabs" />
          </div>
        </div>
      </div>
    </div>
  );
}
