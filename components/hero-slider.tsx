"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface HeroSlide {
  image: string
  alt: string
  link: string
}

export function HeroSlider() {
  const slides: HeroSlide[] = [
    {
      image: "/hero-figure.jpeg",
      alt: "オリジナルフィギュア",
      link: "/products/figure",
    },
    {
      image: "/hero-nameplate.jpeg",
      alt: "ネームプレートキーホルダー",
      link: "/products/nameplate",
    },
    {
      image: "/hero-pet.jpeg",
      alt: "ペットフィギュア",
      link: "/products/pet-figure",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  // 自動スライド切り替え
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative bg-white">
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <Link href={slide.link} className="absolute inset-0">
              <span className="sr-only">詳細を見る</span>
            </Link>
          </div>
        ))}
      </div>

      {/* インジケーター */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`スライド ${index + 1} に移動`}
          />
        ))}
      </div>
    </section>
  )
}
