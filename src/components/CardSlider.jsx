import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Card from "./Card";


export default function CardSlider({ cards }) {
  return (
    <section className="catalogo-slider">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={3}
        centeredSlides={false}
        grabCursor={true}
        breakpoints={{
          320: { 
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: { 
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: { 
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {cards.map((c, i) => (
          <SwiperSlide key={i}>
            <Card {...c} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}