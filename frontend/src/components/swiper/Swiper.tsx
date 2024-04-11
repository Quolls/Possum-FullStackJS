import React, { ReactNode, useState } from "react";
import "./Swiper.css";

interface SwiperProps {
  children: ReactNode;
}

const Swiper: React.FC<SwiperProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const handleSwipe = (direction: number) => {
    setCurrentIndex((prev) => {
      const count = React.Children.count(children);
      let nextIndex = prev + direction;
      // 添加循环逻辑
      if (nextIndex < 0) {
        nextIndex = count - 1; // 循环到最后一张
      } else if (nextIndex >= count) {
        nextIndex = 0; // 循环到第一张
      }
      return nextIndex;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // 重置触摸结束位置
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart - touchEnd > minSwipeDistance) {
      handleSwipe(1); // 向左滑动
    } else if (touchStart - touchEnd < -minSwipeDistance) {
      handleSwipe(-1); // 向右滑动
    }
  };

  return (
    <div
      className="swiper"
      onTouchStart={onTouchStart}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={onTouchEnd}>
      <div
        className="swiper-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {React.Children.map(children, (child) => (
          <div className="swiper-slide">{child}</div>
        ))}
      </div>
      <button
        className="swiper-button-prev hidden md:flex absolute top-1/2 -translate-y-1/2 scale-150 bg-black bg-opacity-50 text-white border-none z-50 text-2xl left-2 md:block"
        onClick={(event) => {
          event.stopPropagation(); // 阻止事件冒泡
          handleSwipe(-1);
        }}>
        ‹
      </button>
      <button
        className="swiper-button-next hidden md:flex absolute top-1/2 -translate-y-1/2 scale-150 bg-black bg-opacity-50 text-white border-none z-50 text-2xl right-2 md:block"
        onClick={(event) => {
          event.stopPropagation(); // 阻止事件冒泡
          handleSwipe(1);
        }}>
        ›
      </button>
    </div>
  );
};

export default Swiper;
